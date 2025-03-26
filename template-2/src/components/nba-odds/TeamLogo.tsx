import React, { useMemo } from "react";
import Image from "next/image";

// Map of team abbreviations to file names
const TEAM_LOGO_MAP: Record<string, string> = {
  ATL: "AtlantaHawks.png",
  BOS: "BostonCeltics.png",
  BKN: "BrooklynNets.png",
  CHA: "CharlotteHornets.png",
  CHI: "ChicagoBulls.png",
  CLE: "ClevelandCavaliers.png",
  DAL: "DallasMavericks.png",
  DEN: "DenverNuggets.png",
  DET: "DetroitPistons.png",
  GSW: "GoldenStateWarriors.png",
  HOU: "HoustonRockets.png",
  IND: "IndianaPacers.png",
  LAC: "LosAngelesClippers.png",
  LAL: "LosAngelesLakers.png",
  MEM: "MemphisGrizzlies.png",
  MIA: "MiamiHeat.png",
  MIL: "MilwaukeeBucks.png",
  MIN: "MinnesotaTimberwolves.png",
  NOP: "NewOrleansPelicans.png",
  NYK: "NewYorkKnicks.png",
  OKC: "OklahomaCityThunder.png",
  ORL: "OrlandoMagic.png",
  PHI: "Philadelphia76ers.png",
  PHX: "PhoenixSuns.png",
  POR: "PortlandTrailBlazers.png",
  SAC: "SacramentoKings.png",
  SAS: "SanAntonioSpurs.png",
  TOR: "TorontoRaptors.png",
  UTA: "UtahJazz.png",
  WAS: "WashingtonWizards.png",
};

// List of valid NBA team abbreviations
const VALID_ABBREVIATIONS = Object.keys(TEAM_LOGO_MAP);

// Default fallback logo component
const FallbackLogo = ({ size = 40 }: { size?: number }) => (
  <div
    className={`flex items-center justify-center bg-gray-700 rounded-full`}
    style={{ width: size, height: size }}
  >
    <span className="text-white font-bold text-xs">NBA</span>
  </div>
);

export const TeamLogo = ({
  abbreviation,
  size = 40,
}: {
  abbreviation: string;
  size?: number;
}) => {
  // Ensure abbreviation is valid
  const validAbbreviation = useMemo(() => {
    if (!abbreviation || !VALID_ABBREVIATIONS.includes(abbreviation)) {
      console.warn(`Invalid team abbreviation: ${abbreviation}`);
      return null;
    }
    return abbreviation;
  }, [abbreviation]);

  // If no valid abbreviation, return fallback logo
  if (!validAbbreviation) {
    return <FallbackLogo size={size} />;
  }

  const logoFileName = TEAM_LOGO_MAP[validAbbreviation];

  // Return logo from NBATeams directory
  return (
    <div style={{ width: size, height: size }} className="relative">
      <Image
        src={`/NBATeams/${logoFileName}`}
        alt={`${validAbbreviation} logo`}
        fill
        className="object-contain"
      />
    </div>
  );
};

export default TeamLogo;
