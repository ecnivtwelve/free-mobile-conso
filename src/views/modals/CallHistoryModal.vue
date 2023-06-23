<template>
    <ion-page>
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Historique d'appels</ion-title>
  
          <ion-buttons slot="end">
            <IonButton class="closeModalBtn" @click="closeModal()" color="dark">
              <X slot="icon-only" />
            </IonButton>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true" class="content inset-background">
  
          <ion-list inset v-for="call in calls" :key="call.number">
            <ion-item color="medium">
                <PhoneCall slot="start" />
                <ion-label>
                    <h2>{{ call.number }}</h2>
                </ion-label>
                <ion-note slot="end">{{ call.calls.length }} appel<span v-if="call.calls.length > 1">s</span></ion-note>
            </ion-item>
            <ion-list>
                <ion-item v-for="callGroup in call.calls" :key="callGroup.date">
                    <ion-label>
                        <h3>{{ callGroup.date }}</h3>
                        <p>appel de {{ callGroup.length }}</p>
                    </ion-label>
                    <ion-note slot="end">{{ callGroup.price }}</ion-note>
                </ion-item>
            </ion-list>
          </ion-list>

          <br/> <br/>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
    // @ts-nocheck
      import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem, IonLabel, IonNote } from '@ionic/vue';
  
      import { X, PhoneCall } from 'lucide-vue-next';
      import { Dialog } from '@capacitor/dialog';
  
      function closeModal() {
          document.dispatchEvent(new CustomEvent('closeModal'));
      }
  
      import { ref, onMounted } from 'vue';
  
      const calls = ref([]);
  
      parseUser(localStorage.getItem('cache') as string);
  
      function parseUser(html: string) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
    
                // #voix
                const voix = doc.querySelector('#voix') as HTMLElement;

                // for each .local in #voix
                voix.querySelectorAll('.local').forEach((local) => {
                    const call = {
                        date: local.querySelector('.date-cell')?.textContent?.trim(),
                        number: local.querySelector('.number-cell')?.textContent?.trim(),
                        length: local.querySelector('.quantity-cell')?.textContent?.trim(),
                        price: local.querySelector('.price-cell')?.textContent?.trim(),
                    };

                    // check if calls contains number
                    const index = calls.value.findIndex((callGroup) => callGroup.number === call.number);

                    if (index !== -1) {
                        calls.value[index].calls.push(call);
                        return;
                    }

                    calls.value.push({
                        number: call.number,
                        calls: [call]
                    });
                });

                console.log(calls.value);
            }
            catch (e) {
                console.error(e);
            }
      }
  </script>
  
  <style scoped>
      
  </style>