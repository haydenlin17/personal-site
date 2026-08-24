/**
 * The server leaderboard, as read from the UnbelievaBoat widget on 24 August 2026.
 *
 * Deliberately holds no usernames. `nameWidth` is the pixel width of the bar
 * that stands in for each name, derived from how long that name was, so the
 * column keeps the ragged shape of a real list without carrying the names
 * themselves. Avatars are copied into public/griff under sequential filenames,
 * so no Discord user ids reach the page either. A few rows never loaded an
 * avatar in the widget and render without one.
 */

export type LeaderboardRow = {
  rank: string;
  avatar: string | null;
  amount: string;
  nameWidth: number;
};

export const capturedOn = "24 August 2026";

export const leaderboard: LeaderboardRow[] = [
  { rank: "#1", avatar: "a01.png", amount: "2,398,890", nameWidth: 76 },
  { rank: "#2", avatar: "a02.png", amount: "1,000,133", nameWidth: 125 },
  { rank: "#3", avatar: "a03.png", amount: "940,957", nameWidth: 104 },
  { rank: "#4", avatar: "a04.png", amount: "862,034", nameWidth: 90 },
  { rank: "#5", avatar: "a05.png", amount: "348,997", nameWidth: 90 },
  { rank: "#6", avatar: "a06.png", amount: "240,284", nameWidth: 90 },
  { rank: "#7", avatar: null, amount: "177,426", nameWidth: 97 },
  { rank: "#8", avatar: "a08.png", amount: "173,059", nameWidth: 104 },
  { rank: "#9", avatar: "a09.png", amount: "144,787", nameWidth: 104 },
  { rank: "#10", avatar: "a10.png", amount: "81,616", nameWidth: 125 },
  { rank: "#11", avatar: "a11.png", amount: "62,523", nameWidth: 125 },
  { rank: "#12", avatar: "a12.png", amount: "61,729", nameWidth: 104 },
  { rank: "#13", avatar: null, amount: "61,116", nameWidth: 97 },
  { rank: "#14", avatar: null, amount: "43,385", nameWidth: 111 },
  { rank: "#15", avatar: "a15.png", amount: "43,063", nameWidth: 111 },
  { rank: "#16", avatar: "a16.png", amount: "38,586", nameWidth: 125 },
  { rank: "#17", avatar: "a17.png", amount: "33,950", nameWidth: 83 },
  { rank: "#18", avatar: "a18.png", amount: "33,873", nameWidth: 83 },
  { rank: "#19", avatar: "a19.png", amount: "32,610", nameWidth: 104 },
  { rank: "#20", avatar: "a20.png", amount: "30,056", nameWidth: 160 },
  { rank: "#21", avatar: "a21.png", amount: "25,622", nameWidth: 118 },
  { rank: "#22", avatar: null, amount: "24,832", nameWidth: 104 },
  { rank: "#23", avatar: "a23.png", amount: "22,425", nameWidth: 69 },
  { rank: "#24", avatar: "a24.png", amount: "22,386", nameWidth: 118 },
  { rank: "#25", avatar: "a25.png", amount: "21,493", nameWidth: 132 },
  { rank: "#26", avatar: "a26.png", amount: "21,150", nameWidth: 104 },
  { rank: "#27", avatar: "a27.png", amount: "20,870", nameWidth: 69 },
  { rank: "#28", avatar: "a28.png", amount: "20,556", nameWidth: 132 },
  { rank: "#29", avatar: "a29.png", amount: "19,050", nameWidth: 190 },
  { rank: "#30", avatar: null, amount: "18,999", nameWidth: 104 },
];
