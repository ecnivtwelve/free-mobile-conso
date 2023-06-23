<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bienvenue</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="content">
        <lottie-player
            src="/animations/Welcome.json"
            autoplay loop class="lottie_anim">
        </lottie-player>

        <div class="welcome">
            <h1>Bienvenue !</h1>
            <p class="main-text">L'app Free Mobile Conso est une app non-officielle qui vous permet d'accéder simplement à votre espace abonné Free.</p>
            <p>Vous pourrez ainsi consulter votre consommation, vos factures, vos options, etc.</p>
            <p class="login-instruct">Pour vous connecter, munissez-vous de votre identifiant à 8 chiffres (celui de votre facture mobile) et de votre mot de passe Free Mobile.</p>
        </div>

        <div class="buttons">
            <ion-nav-link router-direction="forward" :component="LoginIdentifiant">
                <ion-button class="startButton" shape="round">
                    <LoginIcon slot="start" style="margin-right: 8px;" />
                    Se connecter
                </ion-button>
            </ion-nav-link>

            <ion-nav-link router-direction="forward" :component="LoginHelp">
                <ion-button fill="clear" class="startButton" shape="round">
                    <HelpIcon slot="start" style="margin-right: 8px;" />
                    Aide
                </ion-button>
            </ion-nav-link>
        </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// @ts-nocheck
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNavLink } from '@ionic/vue';

    import "@lottiefiles/lottie-player";

    import LoginHelp from './LoginHelp.vue';
    import LoginIdentifiant from './LoginIdentifiant.vue';

    import {
        LogIn as LoginIcon,
        HelpCircle as HelpIcon,
    } from 'lucide-vue-next';
</script>

<style scoped>
    .lottie_anim {
        height: 30vh;
        margin-top: 0px;

        background: #F2F1F6;
        border-bottom: 1px solid #e0e0e0;
    }

    @media (prefers-color-scheme: dark) {
        .lottie_anim {
            background: #121212;
            border-bottom: 1px solid #ffffff20;
        }
    }

    .welcome {
        text-align: left;
        margin: auto 25px;
        margin-top: 20px;
    }

    .welcome * {
        margin: 0;
    }

    .welcome h1 {
        font-size: 1.6em;
        font-weight: 700;

        font-family: var(--main-font);
    }

    .welcome p {
        font-size: 1em;
        font-weight: 400;
        line-height: 1.3em;

        margin-top: 10px;
    }

    .welcome p.login-instruct {
        opacity: 0.6;
        font-size: 0.9em;
        margin-top: 20px;
    }

    .buttons {
        margin: 0 25px;

        position:absolute;
        bottom: calc(env(safe-area-inset-bottom) + 25px);

        display: flex;
        gap: 10px;
    }
</style>