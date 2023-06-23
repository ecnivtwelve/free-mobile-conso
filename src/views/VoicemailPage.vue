<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Messagerie</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="inset-background">

      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      
      <div v-for="msg in messagesList">
        <Transition name="message">
          <ion-list inset v-if="msg.audio">
              <ion-item :href="'tel:'+msg.number" color="medium" button :detail="true">
                <Voicemail slot="start" />
                <ion-label>
                  <h2>{{ msg.number }}</h2>
                </ion-label>
              </ion-item>

              <div style="display: flex;">
                <ion-item lines="none" style="flex: 1;">
                  <ion-label>
                    <p>Date et heure</p>
                    <h3>{{ msg.date }} à {{ msg.time }}</h3>
                  </ion-label>
                </ion-item>
                <ion-item lines="none" style="flex: 1;">
                  <ion-label>
                    <p>Durée</p>
                    <h3>{{ msg.duration }}</h3>
                  </ion-label>
                </ion-item>
              </div>

              <audio controls class="msgAudio">
                  <source :src="msg.audio" type="audio/wav">
                </audio>
          </ion-list>
        </Transition>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

import { Voicemail } from 'lucide-vue-next';

import { ref, onMounted } from 'vue';

import { CapacitorHttp } from '@capacitor/core';

const loggedIn = ref(false);
const loaded = ref(false);
const messagesList = ref([]) as any;

function handleRefresh($event: any) {
  messagesList.value = [];
  loaded.value = false;

  refreshVoicemail($event);
}

async function refreshVoicemail($event: any) {
  const response = await CapacitorHttp.post({
      url: "https://mobile.free.fr/account/messagerie-vocale",
      method: "POST",
      data: {
        "login-ident": localStorage.getItem("identifiants"),
        "login-pwd": localStorage.getItem("password"),
        "bt-login": "1"
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      disableRedirects: false,
      webFetchExtra: {
        credentials: "include"
      }
    })

    localStorage.setItem('cache', response.data);
    parseVoicemail(response.data);

    loaded.value = true;

    if($event) {
      $event.target.complete();
    }
}

async function parseVoicemail(html: string) {
  try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // for each .msg in #messages-list
      const messages = doc.querySelectorAll("#messages-list .msg");
      
      for (let i = 0; i < messages.length; i++) {
          const message = messages[i] as any;

          let isNew = false;
          // if message contains class .msg-new
          if (message.classList.contains("msg-new")) {
              isNew = true;
          }

          const caller = message.querySelector(".msg__details__tel").textContent.trim();
          const date = message.querySelector(".msg__details__date").textContent.split(" (")[0].trim().split("\n")[0].trim();
          const time = message.querySelector(".msg__details__date").textContent.split(" (")[0].trim().split("\n")[1].split("à ")[1].trim();
          const duration = message.querySelector(".msg__details__date").textContent.split(" (")[1].split(")")[0].trim();

          const src = "https://mobile.free.fr/account/messagerie-vocale" + message.querySelectorAll("audio source")[0].src.split("/account/messagerie-vocale")[1];

          const audio = await fetchAudio(src);

          messagesList.value.push({
              new: isNew,
              number: caller,
              date: date,
              time: time,
              duration: duration,
              src: src,
              audio: audio
          });
      }

      console.log(messagesList.value);
  }
  catch (e) {
      console.log(e);
  }
}

async function fetchAudio(src: string) {
  // fetch src
  const response = await CapacitorHttp.get({
      url: src,
      method: "GET",
      disableRedirects: false,
      responseType: "blob",
      webFetchExtra: {
        credentials: "include"
      }
    })

  // play
  return "data:audio/wav;base64," + response.data;
}

if (localStorage.getItem('loggedIn')) {
  loggedIn.value = true;

  if(localStorage.getItem('voicemail-cache')) {
    parseVoicemail(localStorage.getItem('voicemail-cache'));
  } else {
    refreshVoicemail();
  }
}
</script>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>