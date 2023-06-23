<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button defaultHref="#"></ion-back-button>
        </ion-buttons>

        <ion-title>Aide</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="content inset-background">
        <ion-accordion-group>
            <ion-list inset>
                <ion-accordion value="identifiants">
                    <ion-item slot="header" color="medium">
                        <ion-label class="question">Comment trouver mes identifiants ?</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">
                        Votre identifiant abonné se trouve sur vos factures mobile ou dans les emails envoyés par Free Mobile.
                    </div>
                </ion-accordion>
            </ion-list>

            <ion-list inset>
                <ion-accordion value="lost">
                    <ion-item slot="header" color="medium">
                        <ion-label class="question">J'ai perdu mes identifiants</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">
                        Vous pouvez les récupérer par e-mail en consultant <a href="https://mobile.free.fr/account/forget-login">la page officielle de récupération de Free Mobile</a>.
                    </div>
                </ion-accordion>
            </ion-list>

            <ion-list inset>
                <ion-accordion value="how">
                    <ion-item slot="header" color="medium">
                        <ion-label class="question">Comment fonctionne cette application ?</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content">
                        Cette application n'est pas officielle. Elle utilise vos identifiants pour se connecter à votre espace abonné Free Mobile et afficher vos informations. Vos identifiants, mots de passe, et données ne quittent jamais votre appareil.
                    </div>
                </ion-accordion>
            </ion-list>
        </ion-accordion-group>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonAccordionGroup, IonAccordion, IonItem, IonLabel } from '@ionic/vue';
</script>

<style scoped>
    .question {
        font-weight: 600;
    }
</style>