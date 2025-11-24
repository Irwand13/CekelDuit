export const motivationalQuotes = {
  id: [
    "Rajin nabung, masa depan tenang! 💪",
    "Sedikit demi sedikit, lama-lama jadi bukit! 🏔️",
    "Cekel duitmu, jangan sampai kebobolan! 💰",
    "Hemat pangkal kaya, boros pangkal melarat! 🌟",
    "Pelan tapi pasti, tabunganmu pasti terkumpul! 🎯",
    "Jangan kalah sama kopi, masa kalah sama tabungan? ☕",
    "Nabung hari ini, tersenyum masa depan! 😊",
    "Duit itu kayak temen, harus dijaga baik-baik! 👥",
  ],
  jv: [
    "Rek, nggo opo tuku kopi saben dina iki? 😄",
    "Cekel duitmu ben ora mlayu! 💸",
    "Ojo boros, mengko sue nyesel rek! 😅",
    "Nabung sethithik-sethithik, mengko akeh! 🐷",
    "Duit kui ono wingine, ojo mung dipikir saiki! 🌈",
    "Ayo rek, ngirit ben sugih mengko! 💎",
    "Ojo kalah karo tonggo seng rajin nabung! 🏆",
    "Celengan cekel ojo nganti pecah rek! 🪙",
  ],
};

export const ngiritModeMessages = {
  id: [
    "Eh tunggu dulu! Yakin mau beli ini? 🤔",
    "Butuh atau pengen doang nih? 💭",
    "Coba pikir lagi deh, penting gak sih? 🧐",
    "Tabunganmu nangis kalau jadi beli ini lho! 😢",
    "Mode Ngirit ON! Tunda dulu yuk pembeliannya! 🛑",
  ],
  jv: [
    "Rek, yakin iki? Pikir-pikir disek! 🤔",
    "Butuh opo mung pengen tok iki? 💭",
    "Celenganmu nangis rek yen tuku iki! 😢",
    "Nggo opo rek? Tunda disek ojo? 🛑",
    "Ojo-ojo iki mung gengsi tok lho! 🧐",
  ],
};

export const getRandomQuote = (language: 'id' | 'jv'): string => {
  const quotes = motivationalQuotes[language];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getRandomNgiritMessage = (language: 'id' | 'jv'): string => {
  const messages = ngiritModeMessages[language];
  return messages[Math.floor(Math.random() * messages.length)];
};
