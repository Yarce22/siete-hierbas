"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { SiteConfig, HeroSlide } from "@/lib/queries/site-config";

import { InfoBarTab } from "./home-config/info-bar-tab";
import { HeroTab } from "./home-config/hero-tab";
import { HistoriaTab } from "./home-config/historia-tab";
import { HospedajeTab } from "./home-config/hospedaje-tab";
import { PorQueTab } from "./home-config/por-que-tab";
import { PopupTab } from "./home-config/popup-tab";

type Props = {
  config: SiteConfig;
  slides: HeroSlide[];
};

export function HomeConfigClient({ config, slides }: Props) {
  return (
    <Tabs defaultValue="info-bar">
      <TabsList className="mb-6">
        <TabsTrigger value="info-bar">Barra de anuncios</TabsTrigger>
        <TabsTrigger value="hero">Hero (slider)</TabsTrigger>
        <TabsTrigger value="historia">Nuestra historia</TabsTrigger>
        <TabsTrigger value="hospedaje">El Hospedaje</TabsTrigger>
        <TabsTrigger value="por-que">¿Por qué elegirnos?</TabsTrigger>
        <TabsTrigger value="popup">Popup</TabsTrigger>
      </TabsList>

      <TabsContent value="info-bar"><InfoBarTab config={config} /></TabsContent>
      <TabsContent value="hero"><HeroTab slides={slides} /></TabsContent>
      <TabsContent value="historia"><HistoriaTab config={config} /></TabsContent>
      <TabsContent value="hospedaje"><HospedajeTab config={config} /></TabsContent>
      <TabsContent value="por-que"><PorQueTab config={config} /></TabsContent>
      <TabsContent value="popup"><PopupTab config={config} /></TabsContent>
    </Tabs>
  );
}
