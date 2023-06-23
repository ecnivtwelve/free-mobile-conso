<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="#"></ion-back-button>
                </ion-buttons>
        
                <ion-title>Connexion</ion-title>

                <ion-buttons slot="end">
                    <ion-spinner style="margin-right: 10px;" v-if="loading"></ion-spinner>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="content inset-background">

            <div class="loginUI">
                <ion-list inset class="identifiantInput">
                    <ion-item>
                        <ion-input v-model="identifiantsInput" type="tel" placeholder="Identifiant"></ion-input>
                    </ion-item>
                </ion-list>
                
                <ion-list inset class="passwordInput">
                    <ion-item>
                        <ion-input v-model="passwordInput" type="password" placeholder="Mot de passe"></ion-input>
                    </ion-item>
                </ion-list>

                <ion-list inset>
                    <ion-item @click="login()" color="primary" button :detail="false">
                        <ion-label class="loginBtnText">Se connecter</ion-label>
                    </ion-item>
                </ion-list>
            </div>
    
        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">
    // @ts-nocheck

    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSpinner, toastController, modalController } from '@ionic/vue';

    import { ref, onMounted } from 'vue';

    async function presentToast(options:any) {
        const toast = await toastController.create(options);
        await toast.present();
    }

    import { alert } from 'ionicons/icons';
    import { CapacitorHttp } from '@capacitor/core';

    const loading = ref(false);
    const passwordReady = ref(false);

    const identifiantsInput = ref(null) as any as string;
    const passwordInput = ref(null) as any as string;

    async function login() {
        loading.value = true;

        const response = await CapacitorHttp.post({
            url: "https://mobile.free.fr/account/",
            method: "POST",
            data: {
                "login-ident": identifiantsInput.value as any as string,
                "login-pwd": passwordInput.value as any as string,
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

        loading.value = false;

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        // check if flashError exists
        const flashError = doc.querySelector(".flash-error");
        if (flashError) {
            presentToast({
                message: flashError.textContent?.replace('×', '').trim(),
                duration: 2000,
                icon: alert,
                color: "danger"
            });
            return;
        }

        // check if .p-conso exists
        const pConso = doc.querySelector(".p-conso");
        if (pConso) {
            // set logged in
            localStorage.setItem("loggedIn", "true");

            // save credentials in localStorage
            localStorage.setItem("identifiants", identifiantsInput.value);
            localStorage.setItem("password", passwordInput.value);

            // save data in localStorage
            localStorage.setItem("cache", response.data);

            // dismiss modal
            document.dispatchEvent(new Event('loggedIn'));
        }
    }
</script>
  
<style scoped>
    .loginInput {
        font-variant-numeric: tabular-nums;
    }

    .loginBtnText {
        text-align: center;
        font-weight: 500;
    }

    .loginUI {
        margin-top: 10px;
    }

    .password-enter-active {
        transition: all 0.2s cubic-bezier(.3,0,.05,1), opacity 0.2s 0.1s ease-out, transform 0.2s 0.1s cubic-bezier(.3,0,.05,1);
    }

    .password-leave-active {
        transition: all 0.2s 0.1s ease-out, opacity 0.2s ease-out, transform 0.2s ease-out;
    }

    .password-enter-from,
    .password-leave-to {
        opacity: 0;
        margin: auto 16px;
        margin-top: -45px;
        transform: scale(0.9);
    }

    .passwordInput {
        margin-top: -4px !important;
    }
</style>