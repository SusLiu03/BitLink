import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"bitlink-25397","appId":"1:679716231452:web:a4dcbe67ec14c7162ec2d9","storageBucket":"bitlink-25397.appspot.com","apiKey":"AIzaSyB-0ZOkdlextPkuSFssA7YQDa84F-BpfV8","authDomain":"bitlink-25397.firebaseapp.com","messagingSenderId":"679716231452","measurementId":"G-NHY52JY1ZT"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
