<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="conso" href="/tabs/conso">
          <GaugeIcon class="icon"/>
          <ion-label>Consommation</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="voicemail" href="/tabs/voicemail">
          <VoicemailIcon class="icon"/>
          <ion-label>Messagerie</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';

import {
  Gauge as GaugeIcon,
  Voicemail as VoicemailIcon,
} from 'lucide-vue-next';
</script>

<style scoped>
  .icon {
    width: 28px;
    height: 28px;
  }
</style>