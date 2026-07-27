"use client";

import TownPlazaModal from "./modals/TownPlazaModal";
import ArenaModal from "./modals/ArenaModal";
import WorkshopModal from "./modals/WorkshopModal";
import ForgeModal from "./modals/ForgeModal";
import AtelierModal from "./modals/AtelierModal";

export default function Portfolio2D() {
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-obsidian text-slate-900 dark:text-white pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 sm:gap-24">
        <section id="Command Central">
          <TownPlazaModal />
        </section>

        <section id="Cyber Arena">
          <ArenaModal />
        </section>

        <section id="Starship Hangar">
          <WorkshopModal />
        </section>

        <section id="Quantum Forge">
          <ForgeModal />
        </section>

        <section id="Starlight Gallery">
          <AtelierModal />
        </section>
      </div>
    </div>
  );
}
