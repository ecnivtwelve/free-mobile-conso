<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mon compte</ion-title>

        <ion-buttons slot="end">
          <IonButton class="closeModalBtn" @click="closeModal()" color="dark">
            <X slot="icon-only" />
          </IonButton>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="content inset-background">

        <div class="ion-list-title listGroup">
            <p>Compte</p>
        </div>
        
        <ion-list class="listGroup">
            <ion-item>
                <ion-label>
                    <p>Utilisateur</p>
                    <h2>{{identite_bis_text}}</h2>
                </ion-label>
            </ion-item>
            <ion-item>
                <ion-label>
                    <p>Identifiant</p>
                    <h2>{{current_user_infos_line}}</h2>
                </ion-label>
            </ion-item>
            <ion-item>
                <ion-label>
                    <p>Ligne</p>
                    <h2>{{current_user_infos_phone}}</h2>
                </ion-label>
            </ion-item>
        </ion-list>

        <div class="ion-list-title listGroup">
            <p>Actions sur le compte</p>
        </div>
        
        <ion-list class="listGroup" >
            <ion-item button @click="logOut">
                <DoorOpen slot="start" />
                <ion-label>
                    <h2>Se déconnecter</h2>
                    <p>Vous serez déconnecté de votre compte.</p>
                </ion-label>
            </ion-item>
        </ion-list>

        <div class="ion-list-title listGroup">
            <p>A propos de l'app</p>
        </div>
        
        <ion-list class="listGroup" >
            <ion-item>
                <ion-label class="title">Version de l'app</ion-label>
                <ion-label slot="end">{{package_json.version}}</ion-label>
            </ion-item>
        </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// @ts-nocheck
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem, IonLabel } from '@ionic/vue';

    import { X, DoorOpen } from 'lucide-vue-next';
    import { Dialog } from '@capacitor/dialog';

    function closeModal() {
        document.dispatchEvent(new CustomEvent('closeModal'));
    }

    async function logOut() {
        const { value } = await Dialog.confirm({
            title: 'Êtes-vous sûr ?',
            message: `Vous allez être déconnecté de votre compte.`,
            okButtonTitle: 'Se déconnecter',
            cancelButtonTitle: 'Annuler',
        });

        if (!value) return;

        closeModal();
        document.dispatchEvent(new CustomEvent('logOut'));
    }

    import { ref, onMounted } from 'vue';

    const identite_bis_text = ref(null) as any;
    const current_user_infos_line = ref(null) as any;
    const current_user_infos_phone = ref(null) as any;

    import package_json from '../../../package.json';

    parseUser(localStorage.getItem('cache') as string);

    function parseUser(html: string) {
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
        } catch (e) {
            console.error(e);
        }
    }
</script>

<style scoped>
    
</style>