import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// Define interface for logo component props
interface LogoComponentProps {
  size?: number;
}

// List of valid NBA team abbreviations in react-nba-logos
const VALID_ABBREVIATIONS = [
  "ATL",
  "BOS",
  "BKN",
  "CHA",
  "CHI",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GSW",
  "HOU",
  "IND",
  "LAC",
  "LAL",
  "MEM",
  "MIA",
  "MIL",
  "MIN",
  "NOP",
  "NYK",
  "OKC",
  "ORL",
  "PHI",
  "PHX",
  "POR",
  "SAC",
  "SAS",
  "TOR",
  "UTA",
  "WAS",
];

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
  // Ensure abbreviation is valid and exists in react-nba-logos
  const validAbbreviation = useMemo(() => {
    if (!abbreviation || !VALID_ABBREVIATIONS.includes(abbreviation)) {
      console.warn(`Invalid team abbreviation: ${abbreviation}`);
      return null;
    }
    return abbreviation;
  }, [abbreviation]);

  // Use useMemo to cache the component and prevent re-creation on re-renders
  const LogoComponent = useMemo(() => {
    if (!validAbbreviation) {
      return FallbackLogo;
    }

    return dynamic<LogoComponentProps>(
      () =>
        import("react-nba-logos").then((mod) => {
          const Component = mod[validAbbreviation];
          if (!Component) {
            console.error(`Could not load logo for ${validAbbreviation}`);
            return FallbackLogo;
          }
          return Component;
        }),
      {
        loading: () => (
          <div
            style={{ width: size, height: size }}
            className="bg-gray-700 rounded-full animate-pulse"
          ></div>
        ),
        ssr: false,
      }
    );
  }, [validAbbreviation, size]);

  return <LogoComponent size={size} />;
};

export default TeamLogo;
