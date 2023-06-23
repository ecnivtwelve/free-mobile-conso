<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-segment class="selection" value="local" v-model="selectConso" v-if="loggedIn">
          <ion-segment-button value="local">
            <ion-label>En France</ion-label>
          </ion-segment-button>
          <ion-segment-button value="roaming">
            <ion-label>A l'étranger</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-title v-else>Consommation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="inset-background">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list inset v-if="!loggedIn">
        <ion-item button @click="login()">
          <AlertTriangle slot="start" />
          <ion-label class="ion-text-wrap">
            <h2>Vous n'êtes pas connecté</h2>
            <p>Connectez-vous pour voir votre consommation et accéder à vos données</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list inset v-if="loggedIn">
        <ion-item>
          <User2 slot="start" />
          <ion-label>
            <h2 class="user-name">Bonjour, <span>{{identite_bis_text.split(' ')[0]}}</span></h2>
            <p class="user-number">{{ current_user_infos_phone }}</p>
          </ion-label>
          <ion-button fill="clear" slot="end" @click="openModal(UserModal)">
            <MoreVertical slot="icon-only" />
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label class="title">Prochaine période</ion-label>
          <ion-label slot="end" style="text-align: end;">
            <span>{{ next_period }}</span>
            <p>dans {{ next_period_days }} jours</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-list-title" v-if="loggedIn">
        <p>Usage des données</p>
      </div>

      <ion-list inset v-if="loggedIn">
        <ion-item>
          <Fuel slot="start" />
          <ion-label>
            <p>Consommation</p>
            <h2>{{ conso[selectConso].data.used }} / {{ conso[selectConso].data.total }} Go</h2>
            <ion-progress-bar style="margin-top: 10px;" :value="conso[selectConso].data.used / conso[selectConso].data.total"></ion-progress-bar>
          </ion-label>
          
        </ion-item>
        <ion-item>
          <Euro slot="start" />
          <ion-label>
            <p>Hors-forfait</p>
            <h2>{{ conso[selectConso].data.price.toFixed(2) }} €</h2>
          </ion-label>
        </ion-item>

        <Transition name="item-list">
          <ion-item v-if="selectConso != 'roaming'">
            <Leaf slot="start" color="green" />
            <ion-label>
              <p>Empreinte carbone</p>
              <h2>{{ conso[selectConso].data.carbon }} g CO2e</h2>
            </ion-label>
          </ion-item>
        </Transition>
      </ion-list>

      <div class="ion-list-title" v-if="loggedIn">
        <p>Appels</p>
      </div>

      <ion-list inset v-if="loggedIn">
        <ion-item @click="openModal(CallHistoryModal)" button :detail="true">
          <PhoneCall v-if="selectConso == 'local'" slot="start" />
          <PhoneOutgoing v-else slot="start" />
          <ion-label>
            <p v-if="selectConso == 'local'">Vers la France</p>
            <p v-else>Appels émis</p>
            <h2>{{ conso[selectConso].calls.france }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <Globe2 v-if="selectConso == 'local'" slot="start" />
          <PhoneIncoming v-else slot="start" />
          <ion-label>
            <p v-if="selectConso == 'local'">Vers l'international</p>
            <p v-else>Appels reçus</p>
            <h2>{{ conso[selectConso].calls.international }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <Euro slot="start" />
          <ion-label>
            <p>Hors-forfait</p>
            <h2>{{ conso[selectConso].calls.price.toFixed(2) }} €</h2>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-list-title" v-if="loggedIn">
        <p>SMS</p>
      </div>

      <ion-list inset v-if="loggedIn">
        <ion-item @click="openModal(SmsHistoryModal)" button :detail="true">
          <MessageSquare slot="start" />
          <ion-label>
            <p>Envoyés</p>
            <h2>{{ conso[selectConso].sms.count }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <Euro slot="start" />
          <ion-label>
            <p>Hors-forfait</p>
            <h2>{{ conso[selectConso].sms.price.toFixed(2) }} €</h2>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="ion-list-title" v-if="loggedIn">
        <p>MMS</p>
      </div>

      <ion-list inset v-if="loggedIn">
        <ion-item>
          <MessageSquare slot="start" />
          <ion-label>
            <p>Envoyés</p>
            <h2>{{ conso[selectConso].mms.count }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <Euro slot="start" />
          <ion-label>
            <p>Hors-forfait</p>
            <h2>{{ conso[selectConso].mms.price.toFixed(2) }} €</h2>
          </ion-label>
        </ion-item>
      </ion-list>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  // @ts-nocheck

  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, modalController, IonList, IonItem, IonLabel, IonRefresher, IonRefresherContent, IonProgressBar, IonSegment, IonSegmentButton } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';

  import { User2, MoreVertical, AlertTriangle, Fuel, Euro, Leaf, PhoneCall, Globe2, MessageSquare, PhoneOutgoing, PhoneIncoming } from 'lucide-vue-next';

  import { ref, onMounted } from 'vue';

  import LoginModalController from '@/views/modals/LoginModalController.vue';
  import UserModal from '@/views/modals/UserModal.vue';
  import CallHistoryModal from '@/views/modals/CallHistoryModal.vue';
  import SmsHistoryModal from '@/views/modals/SmsHistoryModal.vue';

  const modal = ref(null) as any;
  const modalUser = ref(null) as any;
  const selectConso = ref('local');

  // variables
  const loggedIn = ref(false);
  const identite_bis_text = ref(null) as any;
  const current_user_infos_line = ref(null) as any;
  const current_user_infos_phone = ref(null) as any;

  const next_period = ref(null) as any;
  const next_period_days = ref(null) as any;

  const conso = ref({
    local: {
      data: {
        used: 0,
        total: 0,
        price: 0,
        carbon: 0
      },
      calls: {
        france: "",
        international: "",
        price: 0
      },
      sms: {
        count: 0,
        price: 0
      },
      mms : {
        count: 0,
        price: 0
      },
    },
    roaming: {
      data: {
        used: 0,
        total: 0,
        price: 0,
        carbon: 0
      },
      calls: {
        france: "",
        international: "",
        price: 0
      },
      sms: {
        count: 0,
        price: 0
      },
      mms : {
        count: 0,
        price: 0
      },
    },
  })

  // refresh
  import { CapacitorHttp } from '@capacitor/core';
  async function refresh(event: any) {
    const response = await CapacitorHttp.post({
      url: "https://mobile.free.fr/account/",
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
    parseConso(response.data);

    if (event) {
      event.target.complete();
    }
  }

  // handle refresh
  function handleRefresh(event) {
    if (loggedIn.value) {
      refresh(event);
    }
    else {
      event.target.complete();
    }
  }

  // login
  const login = async () => {
    modal.value = await modalController.create({
      component: LoginModalController,
      presentingElement: document.getElementById('main-page') as HTMLIonModalElement,
      canDismiss: false
    });

    await modal.value.present();
  }

  // open modal
  const openModal = async (modal: any) => {
    modalUser.value = await modalController.create({
      component: modal,
      presentingElement: document.getElementById('main-page') as HTMLIonModalElement,
      canDismiss: true
    });

    await modalUser.value.present();
  }

  document.addEventListener('closeModal', () => {
    modalUser.value.dismiss();
  });

  // on event loggedIn
  document.addEventListener('loggedIn', () => {
    modal.value.canDismiss = true;
    modal.value.dismiss();

    loggedIn.value = true;
    parseConso(localStorage.getItem('cache'));
  });

  // check login
  if (localStorage.getItem('loggedIn')) {
    loggedIn.value = true;
    parseConso(localStorage.getItem('cache'));
  }
  else {
    setTimeout(() => {
      login();
    }, 50);
  }

  document.addEventListener('logOut', () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('cache');
    setTimeout(() => {
      login();
    }, 200);
  });

  // parse conso
  function parseConso(html: string) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // (nom) .identite_bis
      const identite_bis = doc.querySelector('.identite_bis') as HTMLElement;
      identite_bis_text.value = identite_bis.textContent?.trim();

      // (ligne et numéro) .current-user__infos > smaller[1] > span
      const current_user_infos = doc.querySelector('.current-user__infos') as HTMLElement;
      const current_user_infos_smaller = current_user_infos.querySelectorAll('.smaller');

      const current_user_infos_smaller_span1 = current_user_infos_smaller[1].querySelector('span') as HTMLElement;
      current_user_infos_phone.value = current_user_infos_smaller_span1.textContent?.trim();

      const current_user_infos_smaller_span0 = current_user_infos_smaller[0].querySelector('span') as HTMLElement;
      current_user_infos_line.value = current_user_infos_smaller_span0.textContent?.trim();

      // next period
      const next_period_elem = doc.querySelector('.next-period') as HTMLElement;
      next_period.value = next_period_elem.textContent?.trim().split(' le ')[1];

      // convert next period (26 août 2021) to (2021-08-26)
      const next_period_split = next_period.value.split(' ');
      const next_period_split_day = next_period_split[0];
      const next_period_split_month = next_period_split[1];
      const next_period_split_year = next_period_split[2];

      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];

      let next_period_split_month_index = months.indexOf(next_period_split_month) + 1;
      if (next_period_split_month_index < 10) {
        next_period_split_month_index = '0' + next_period_split_month_index;
      }
      const next_period_date = next_period_split_year + '-' + next_period_split_month_index + '-' + next_period_split_day;

      console.log(next_period_date);

      // get days left before next period
      const today = new Date();
      const next_period_date_date = new Date(next_period_date);

      const diffTime = Math.abs(next_period_date_date.getTime() - today.getTime());
      next_period_days.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // repeat for local and roaming

      const targets = [
        conso.value.local as any,
        conso.value.roaming as any
      ];

      for (const target of targets) {
        let datasheet = '.conso-local';

        if (target === conso.value.roaming) {
          datasheet = '.conso-roaming';
        }

        // (data Go) .conso-container-infos[0] > .number-circle
        const conso_container_infos = doc.querySelector(datasheet)?.querySelectorAll('.conso-container-infos') as any;

        // cercle des données
        const number_circle_text = conso_container_infos[0].querySelector('.number-circle')?.textContent?.trim().split('  /') as any;

        // data (Go)
        if(number_circle_text[0].includes('Mo')) {
          number_circle_text[0] = number_circle_text[0].replace('Mo', 'Go');

          // diviser par 1000
          number_circle_text[0] = parseFloat(number_circle_text[0].split('Go')[0].replace(',', '.')) / 1000 + 'Go';
        }

        target.data.used = parseFloat(number_circle_text[0].split('Go')[0].replace(',', '.'));
        target.data.total = parseFloat(number_circle_text[1].split('Go')[0].replace(',', '.'));

        // hors forfait (€)
        target.data.price = parseFloat(conso_container_infos[0].querySelector('.text-conso-content')?.querySelectorAll('p')[1]?.textContent?.trim().split(' : ')[1].split('€')[0].replace(',', '.') as any);

        // carbone (g CO2e)
        target.data.carbon = parseFloat(conso_container_infos[0].querySelector('.text-conso-content')?.querySelectorAll('p')[2]?.textContent?.trim().split(' : ')[1].split('g CO2e')[0].replace(',', '.') as any);

        // appels
        target.calls.france = conso_container_infos[1].querySelector('.text-conso-content')?.querySelectorAll('p')[0]?.querySelectorAll('span')[0].textContent?.trim() as any;

        target.calls.international = conso_container_infos[1].querySelector('.text-conso-content')?.querySelectorAll('p')[1]?.querySelectorAll('span')[0].textContent?.trim() as any;

        target.calls.price = parseFloat(conso_container_infos[1].querySelector('.text-conso-content')?.querySelectorAll('p')[2]?.textContent?.trim().split(' : ')[1].split('€')[0].replace(',', '.') as any);

        // SMS
        target.sms.count = parseInt(conso_container_infos[2].querySelector('.text-conso-content')?.querySelectorAll('p')[0]?.textContent?.trim().split(' SMS / ')[0] as any);

        target.sms.price = parseFloat(conso_container_infos[2].querySelector('.text-conso-content')?.querySelectorAll('p')[1]?.textContent?.trim().split(' : ')[1].split('€')[0].replace(',', '.') as any);

        // MMS
        target.mms.count = parseInt(conso_container_infos[3].querySelector('.text-conso-content')?.querySelectorAll('p')[0]?.textContent?.trim().split(' MMS / ')[0] as any);

        target.mms.price = parseFloat(conso_container_infos[3].querySelector('.text-conso-content')?.querySelectorAll('p')[1]?.textContent?.trim().split(' : ')[1].split('€')[0].replace(',', '.') as any);
      }

      console.log(conso.value);
    }
    catch (e) {
      console.error(e);
    }
  }
</script>

<style scoped>
  .user-name {
    font-family: var(--main-font) !important;
    letter-spacing: -0.02em;

    font-weight: 700 !important;
    font-size: 1.2em;

    display: flex;
    align-items: center;
    gap: 4px;
  }

  .user-name span {
    font-weight: 500 !important;
  }

  .user-name:after {
    content: ' ';
    display: block;
    width: 12px;
    height: 12px;
    background-color: #f2c60f;
    border-radius: 300px;
    margin-left: 2px;
  }

  .user-number {
    font-family: var(--main-font) !important;
    font-weight: 500 !important;
    font-size: 0.9em;
    color: #666;
  }
</style>