"use client";

import React, { useState, useEffect } from "react";
import { Calculator, ChevronDown, Filter, ArrowDownUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getArbitrageData, ArbitrageOpportunity } from "@/lib/supabase-utils";

// BlurredContent component
const BlurredContent = ({ message }: { message: string }) => (
  <div className="relative">
    <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
      <div className="bg-white/80 p-6 rounded-lg shadow-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-2">Subscription Required</h3>
        <p className="mb-4">{message}</p>
        <Link href="/signup">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Sign Up Now
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default function NormalArbitragePage() {
  const { isLoggedIn, isLoading } = useAuth();

  // State for filters
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedSportsbooks, setSelectedSportsbooks] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [sortByArbitrage, setSortByArbitrage] = useState(true);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<ArbitrageOpportunity | null>(null);
  const [totalWager, setTotalWager] = useState("1000");

  // Add a new state variable to track whether to use rounded values
  const [useRoundedWager, setUseRoundedWager] = useState(false);
  const [roundedSecondWager, setRoundedSecondWager] = useState("0.00");

  // State for the arbitrage data
  const [arbitrageData, setArbitrageData] = useState<{
    opportunities: ArbitrageOpportunity[];
    sports: string[];
    sportsbooks: string[];
    events: string[];
  }>({
    opportunities: [],
    sports: [],
    sportsbooks: [],
    events: [],
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Fetch arbitrage data when component mounts
  useEffect(() => {
    async function fetchData() {
      if (isLoggedIn) {
        setIsDataLoading(true);
        try {
          const filters = {
            sports: selectedSports.length > 0 ? selectedSports : undefined,
            sportsbooks:
              selectedSportsbooks.length > 0 ? selectedSportsbooks : undefined,
            events: selectedEvents.length > 0 ? selectedEvents : undefined,
          };
          const data = await getArbitrageData(
            // Only include filters if they have values
            Object.keys(filters).length > 0 ? filters : undefined
          );
          setArbitrageData(data);
        } catch (error) {
          console.error("Error fetching arbitrage data:", error);
        } finally {
          setIsDataLoading(false);
        }
      }
    }

    fetchData();
  }, [isLoggedIn, selectedSports, selectedSportsbooks, selectedEvents]);

  // Filter and sort the data based on selections
  const filteredData = arbitrageData.opportunities
    .filter(
      (item) =>
        (selectedSports.length === 0 ||
          selectedSports.some(
            (sport) => sport.toUpperCase() === item.sport.toUpperCase()
          )) &&
        (selectedEvents.length === 0 || selectedEvents.includes(item.event)) &&
        (selectedSportsbooks.length === 0 ||
          item.lines.some((line) =>
            selectedSportsbooks.includes(line.sportsbook)
          ))
    )
    .sort((a, b) => {
      if (sortByArbitrage) {
        return b.profit - a.profit; // Sort by descending profit
      }
      return 0; // No sorting
    });

  // Handle opening the modal with a specific opportunity
  const handleOpenModal = (opportunity: ArbitrageOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
    // Reset rounding when opening a new opportunity
    setUseRoundedWager(false);
  };

  // Convert American odds to decimal format
  const convertOddsToDecimal = (americanOdds: string) => {
    const odds = Number.parseInt(
      americanOdds.replace("+", "").replace("-", "")
    );
    if (americanOdds.startsWith("+")) {
      return 1 + odds / 100;
    } else {
      return 1 + 100 / odds;
    }
  };

  // Calculate optimal wager distribution
  const calculateWagers = () => {
    if (!selectedOpportunity || !totalWager) return { wager1: 0, wager2: 0 };

    const line1 = selectedOpportunity.lines[0];
    const line2 = selectedOpportunity.lines[1];

    // Convert American odds to decimal
    const decimal1 = convertOddsToDecimal(line1.odds);
    const decimal2 = convertOddsToDecimal(line2.odds);

    // Calculate implied probabilities
    const impliedProb1 = 1 / decimal1;
    const impliedProb2 = 1 / decimal2;

    // Calculate wager proportions
    const totalImpliedProb = impliedProb1 + impliedProb2;
    const proportion1 = impliedProb2 / totalImpliedProb;
    const proportion2 = impliedProb1 / totalImpliedProb;

    // Calculate wager amounts
    const wager1 = Number.parseFloat(totalWager) * proportion1;
    const wager2 = Number.parseFloat(totalWager) * proportion2;

    // Calculate potential profit
    const profit = wager1 * decimal1 - Number.parseFloat(totalWager);

    return {
      wager1: wager1.toFixed(2),
      wager2: wager2.toFixed(2),
      profit: profit.toFixed(2),
      roi: ((profit / Number.parseFloat(totalWager)) * 100).toFixed(2),
    };
  };

  // Update the calculateSecondWager function to handle rounded values
  const calculateSecondWager = () => {
    if (
      !selectedOpportunity ||
      !totalWager ||
      isNaN(Number.parseFloat(totalWager))
    )
      return "0.00";

    const wager1 = Number.parseFloat(totalWager);
    const odds1 = selectedOpportunity.lines[0].odds;
    const odds2 = selectedOpportunity.lines[1].odds;

    const decimal1 = convertOddsToDecimal(odds1);
    const decimal2 = convertOddsToDecimal(odds2);

    const wager2 = (wager1 * decimal1) / decimal2;

    if (useRoundedWager) {
      return roundedSecondWager;
    }

    return wager2.toFixed(2);
  };

  // Update the calculatePayout function to use the rounded value when appropriate
  const calculatePayout = (betIndex: number) => {
    if (
      !selectedOpportunity ||
      !totalWager ||
      isNaN(Number.parseFloat(totalWager))
    )
      return 0;

    const wager1 = Number.parseFloat(totalWager);
    let wager2 = Number.parseFloat(calculateSecondWager());

    if (useRoundedWager && betIndex === 1) {
      wager2 = Number.parseFloat(roundedSecondWager);
    }

    const odds1 = selectedOpportunity.lines[0].odds;
    const odds2 = selectedOpportunity.lines[1].odds;

    const decimal1 = convertOddsToDecimal(odds1);
    const decimal2 = convertOddsToDecimal(odds2);

    if (betIndex === 0) {
      return wager1 * decimal1;
    } else {
      return wager2 * decimal2;
    }
  };

  // Calculate implied probability from American odds
  const calculateImpliedProbability = (betIndex: number) => {
    if (!selectedOpportunity) return 0;

    const odds = selectedOpportunity.lines[betIndex].odds;
    const oddsValue = Number.parseInt(odds.replace("+", "").replace("-", ""));

    if (odds.startsWith("+")) {
      return 100 / (oddsValue + 100);
    } else {
      return oddsValue / (oddsValue + 100);
    }
  };

  // Calculate devigged probabilities
  const calculateDevigged = () => {
    if (!selectedOpportunity) return [0, 0];

    const prob1 = calculateImpliedProbability(0);
    const prob2 = calculateImpliedProbability(1);

    const totalProb = prob1 + prob2;

    return [prob1 / totalProb, prob2 / totalProb];
  };

  // Calculate total devigged probability
  const calculateTotalDevigged = () => {
    const devigged = calculateDevigged();
    return devigged[0] + devigged[1];
  };

  // Calculate expected payout based on devigged probabilities
  const calculateExpectedPayout = () => {
    if (
      !selectedOpportunity ||
      !totalWager ||
      isNaN(Number.parseFloat(totalWager))
    )
      return 0;

    const devigged = calculateDevigged();
    const payout1 = calculatePayout(0);
    const payout2 = calculatePayout(1);

    return devigged[0] * payout1 + devigged[1] * payout2;
  };

  // Calculate sum of wagers
  const calculateSumOfWagers = () => {
    if (
      !selectedOpportunity ||
      !totalWager ||
      isNaN(Number.parseFloat(totalWager))
    )
      return 0;

    const wager1 = Number.parseFloat(totalWager);
    let wager2 = Number.parseFloat(calculateSecondWager());

    if (useRoundedWager) {
      wager2 = Number.parseFloat(roundedSecondWager);
    }

    return wager1 + wager2;
  };

  // Calculate expected profit
  const calculateExpectedProfit = () => {
    return calculateExpectedPayout() - calculateSumOfWagers();
  };

  // Update the calculateExpectedArbitragePercentage function to use Expected Payout as the denominator
  const calculateExpectedArbitragePercentage = () => {
    const expectedPayout = calculateExpectedPayout();
    if (expectedPayout === 0) return 0;

    return (calculateExpectedProfit() / expectedPayout) * 100;
  };

  // Update the calculateGuaranteedProfit function to use rounded values
  const calculateGuaranteedProfit = () => {
    if (
      !selectedOpportunity ||
      !totalWager ||
      isNaN(Number.parseFloat(totalWager))
    )
      return 0;

    const wager1 = Number.parseFloat(totalWager);
    let wager2 = Number.parseFloat(calculateSecondWager());

    if (useRoundedWager) {
      wager2 = Number.parseFloat(roundedSecondWager);
    }

    const payout1 = calculatePayout(0);
    const payout2 = calculatePayout(1);

    const profit1 = payout1 - (wager1 + wager2);
    const profit2 = payout2 - (wager1 + wager2);

    return Math.min(profit1, profit2);
  };

  const wagerCalculations = calculateWagers();

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Normal Arbitrage
        </h1>

        {/* Public Content Section - Visible to all users */}
        <section className="mb-16 bg-gray-900/50 p-8 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            What is Normal Arbitrage?
          </h2>
          <p className="text-gray-300 mb-6">
            Normal Arbitrage is a betting strategy that exploits differences in
            odds between sportsbooks to guarantee a profit regardless of the
            outcome. By placing carefully calculated bets on all possible
            outcomes of an event at different sportsbooks with favorable odds,
            you can secure a profit no matter what happens in the actual event.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Example:</h3>
            <p className="text-gray-300 mb-4">
              Let's look at a baseball game between the Yankees and Red Sox:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>At Sportsbook A, the Yankees are +150 (2.50 decimal)</li>
              <li>At Sportsbook B, the Red Sox are +115 (2.15 decimal)</li>
            </ul>

            <h4 className="font-semibold mb-2">
              Using the Arbitrage Calculator:
            </h4>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
              <li>Input: Yankees at +150, Red Sox at +115</li>
              <li>
                The calculator determines you should bet $214.77 on the Yankees
                and $285.23 on the Red Sox (with a total bankroll of $500)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Outcome calculation:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                If Yankees win: $214.77 × 2.50 = $536.93 (profit of $36.93)
              </li>
              <li>
                If Red Sox win: $285.23 × 2.15 = $613.24 (profit of $113.24)
              </li>
            </ul>

            <p className="text-blue-400 font-semibold">
              This creates a no-risk profit of at least $36.93 (a 7.4% ROI)
              regardless of which team wins.
            </p>
          </div>
        </section>

        {/* Premium Content Section - Blurred for non-logged in users */}
        <section className="relative">
          {/* Loading state */}
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !isLoggedIn ? (
            <BlurredContent message="Log in or subscribe to view real-time arbitrage opportunities from multiple sportsbooks." />
          ) : null}

          {/* Premium content - visible but blurred for non-logged in users */}
          <div
            className={`relative ${
              !isLoggedIn ? "opacity-20 pointer-events-none" : ""
            }`}
          >
            <div className="container mx-auto px-4 py-6">
              {/* Filters */}
              <div className="bg-gray-900/50 mb-6 border border-gray-800 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg flex items-center text-white">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sport Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block text-gray-300">
                        Sport
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            {selectedSports.length === 0
                              ? "All Sports"
                              : `${selectedSports.length} selected`}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 border border-gray-700 text-white">
                          {arbitrageData.sports.map((sport) => (
                            <DropdownMenuCheckboxItem
                              key={sport}
                              checked={selectedSports.includes(sport)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSports([...selectedSports, sport]);
                                } else {
                                  setSelectedSports(
                                    selectedSports.filter((s) => s !== sport)
                                  );
                                }
                              }}
                            >
                              {sport}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Sportsbook Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block text-gray-300">
                        Sportsbooks
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            {selectedSportsbooks.length === 0
                              ? "All Sportsbooks"
                              : `${selectedSportsbooks.length} selected`}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 border border-gray-700 text-white">
                          {arbitrageData.sportsbooks.map((book) => (
                            <DropdownMenuCheckboxItem
                              key={book}
                              checked={selectedSportsbooks.includes(book)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSportsbooks([
                                    ...selectedSportsbooks,
                                    book,
                                  ]);
                                } else {
                                  setSelectedSportsbooks(
                                    selectedSportsbooks.filter(
                                      (b) => b !== book
                                    )
                                  );
                                }
                              }}
                            >
                              {book}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Game Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block text-gray-300">
                        Games
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            {selectedEvents.length === 0
                              ? "All Games"
                              : `${selectedEvents.length} selected`}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-gray-800 border border-gray-700 text-white max-h-[300px] overflow-y-auto">
                          {arbitrageData.events.map((event) => (
                            <DropdownMenuCheckboxItem
                              key={event}
                              checked={selectedEvents.includes(event)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEvents([...selectedEvents, event]);
                                } else {
                                  setSelectedEvents(
                                    selectedEvents.filter((e) => e !== event)
                                  );
                                }
                              }}
                            >
                              {event}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arbitrage Opportunities Table */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800 border-b border-gray-700">
                    <TableRow>
                      <TableHead className="w-1/5 font-semibold text-white">
                        Event
                      </TableHead>
                      <TableHead className="w-1/10 font-semibold text-white">
                        <div className="flex items-center">
                          <span>% Arbitrage</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-6 w-6 text-white hover:bg-gray-700"
                            onClick={() => setSortByArbitrage(!sortByArbitrage)}
                          >
                            <ArrowDownUp className="h-4 w-4" />
                            <span className="sr-only">Sort by arbitrage</span>
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead className="w-1/10 font-semibold text-white">
                        Book
                      </TableHead>
                      <TableHead className="w-2/5 font-semibold text-white">
                        Bet Name
                      </TableHead>
                      <TableHead className="w-1/5 font-semibold text-white">
                        Odds
                      </TableHead>
                      <TableHead className="w-1/10 font-semibold text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isDataLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-gray-500"
                        >
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-gray-500"
                        >
                          {isLoggedIn
                            ? "No arbitrage opportunities available right now. Check back later."
                            : "Log in to view arbitrage opportunities."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Display arbitrage opportunities
                      filteredData.map((opportunity) => (
                        <React.Fragment key={opportunity.id}>
                          {/* First row for first sportsbook */}
                          <TableRow className="border-b border-gray-800 hover:bg-transparent">
                            <TableCell
                              rowSpan={2}
                              className="align-middle text-white"
                            >
                              <div>
                                <div className="font-medium">
                                  {opportunity.event}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {opportunity.game_date} •{" "}
                                  {opportunity.game_time}
                                </div>
                                {/* Add bet type indicator if not moneyline */}
                                {opportunity.bet !== "Moneyline" && (
                                  <div className="text-xs text-blue-400 mt-1 font-medium">
                                    {opportunity.bet}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              rowSpan={2}
                              className="align-middle text-center"
                            >
                              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                                {opportunity.profit.toFixed(2)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 text-blue-400 bg-transparent cursor-pointer hover:bg-blue-900/20 transition-colors"
                                onClick={() => {
                                  if (opportunity.lines[0].book_link) {
                                    window.open(
                                      opportunity.lines[0].book_link,
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                {opportunity.lines[0].sportsbook}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-300">
                              {opportunity.lines[0].line}
                            </TableCell>
                            <TableCell className="font-medium text-white">
                              {opportunity.lines[0].odds}
                            </TableCell>
                            <TableCell
                              rowSpan={2}
                              className="align-middle text-right"
                            >
                              <Button
                                size="sm"
                                onClick={() => handleOpenModal(opportunity)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Calculator className="mr-1 h-4 w-4" />
                                Calculate
                              </Button>
                            </TableCell>
                          </TableRow>
                          {/* Second row for second sportsbook */}
                          <TableRow className="border-b border-gray-800 border-dashed hover:bg-transparent">
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-blue-500/30 text-blue-400 bg-transparent cursor-pointer hover:bg-blue-900/20 transition-colors"
                                onClick={() => {
                                  if (opportunity.lines[1].book_link) {
                                    window.open(
                                      opportunity.lines[1].book_link,
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                {opportunity.lines[1].sportsbook}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-300">
                              {opportunity.lines[1].line}
                            </TableCell>
                            <TableCell className="font-medium text-white">
                              {opportunity.lines[1].odds}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Arbitrage Calculator Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-blue-400">
              Arbitrage Calculator
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Calculate optimal wager distribution for this arbitrage
              opportunity.
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h3 className="font-medium text-white">
                  {selectedOpportunity.event}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-400 bg-transparent"
                  >
                    {selectedOpportunity.bet}
                  </Badge>
                  <p className="text-sm text-gray-400">
                    {selectedOpportunity.game_date} •{" "}
                    {selectedOpportunity.game_time}
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-3">
                {selectedOpportunity.lines.map((line, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <Badge
                        variant="outline"
                        className="mr-2 border-blue-500/30 text-blue-400 bg-transparent cursor-pointer hover:bg-blue-900/20 transition-colors"
                        onClick={() => {
                          if (line.book_link) {
                            window.open(line.book_link, "_blank");
                          }
                        }}
                      >
                        {line.sportsbook}
                      </Badge>
                      <span className="text-sm text-gray-300">{line.line}</span>
                    </div>
                    <span className="font-medium text-white">{line.odds}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <Label htmlFor="wager1" className="text-sm text-gray-300">
                    Wager on {selectedOpportunity.lines[0].sportsbook} ($)
                  </Label>
                  <Input
                    id="wager1"
                    type="number"
                    value={totalWager}
                    onChange={(e) => {
                      setTotalWager(e.target.value);
                      // Reset rounding when changing wager
                      setUseRoundedWager(false);
                    }}
                    className="mt-1 bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-500"
                  />
                </div>

                <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="wager2" className="text-sm text-gray-300">
                      Wager on {selectedOpportunity.lines[1].sportsbook} ($)
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs border-blue-500/30 text-blue-400 hover:bg-gray-700"
                      onClick={() => {
                        // Calculate the optimal wager for the second bet
                        const wager1 = Number.parseFloat(totalWager);
                        if (isNaN(wager1)) return;

                        const odds1 = selectedOpportunity.lines[0].odds;
                        const odds2 = selectedOpportunity.lines[1].odds;

                        const decimal1 = convertOddsToDecimal(odds1);
                        const decimal2 = convertOddsToDecimal(odds2);

                        const wager2 = (wager1 * decimal1) / decimal2;

                        // Round to nearest $5
                        const roundedWager2 = Math.round(wager2 / 5) * 5;

                        // Update the state
                        setRoundedSecondWager(roundedWager2.toFixed(2));
                        setUseRoundedWager(true);
                      }}
                    >
                      Round to $5
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Input
                      id="wager2"
                      type="text"
                      value={
                        useRoundedWager
                          ? roundedSecondWager
                          : calculateSecondWager()
                      }
                      readOnly
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-300">
                  Payout Information
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">
                      {selectedOpportunity.lines[0].sportsbook} Payout
                    </p>
                    <p className="font-bold text-blue-400">
                      ${calculatePayout(0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">
                      {selectedOpportunity.lines[1].sportsbook} Payout
                    </p>
                    <p className="font-bold text-blue-400">
                      ${calculatePayout(1).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      Devigged Probability
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm font-medium text-gray-300">
                        {selectedOpportunity.lines[0].sportsbook}:{" "}
                        {calculateDevigged()[0].toFixed(4)}
                      </p>
                      <p className="text-sm font-medium text-gray-300">
                        {selectedOpportunity.lines[1].sportsbook}:{" "}
                        {calculateDevigged()[1].toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-gray-700 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">
                      Total Devigged Probability:
                    </span>
                    <span className="font-medium text-white">
                      {calculateTotalDevigged().toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-900/20 p-3 rounded-md border border-green-900/30">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">
                      Expected Payout:
                    </span>
                    <span className="font-bold text-green-500">
                      ${calculateExpectedPayout().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-300">
                      Sum of Wagers:
                    </span>
                    <span className="font-bold text-green-500">
                      ${calculateSumOfWagers().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-300">
                      Expected Profit:
                    </span>
                    <span className="font-bold text-green-500">
                      ${calculateExpectedProfit().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-300">
                      Expected Arbitrage %:
                    </span>
                    <span className="font-bold text-green-500">
                      {calculateExpectedArbitragePercentage().toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
