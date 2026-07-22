// =======================================
// META EARN LANGUAGE SYSTEM
// =======================================

const LANG = {

en:{
    
loading:"Loading...",
referralCode:"Referral Code",
contactUs:"Contact Us",
currency:"ETB",
dailyWelcomeBonus:"Daily Welcome Bonus",
loginRequired:"Please login first.",
sessionExpired:"Session expired. Please login again.",
serverError:"Cannot connect to server.",
// Dashboard
dashboard:"Dashboard",
home:"Home",
profile:"Profile",
orders:"Orders",
deposits:"Deposits",
withdrawal:"Withdrawal",
wallet:"Wallet",
balance:"Balance",
availableBalance:"Available Balance",
referralCode:"Referral Code",
vipLevel:"VIP Level",
upgradeLevel:"Upgrade Level",
learnMore:"Learn More",
aboutUs:"About Us",
contactUs:"Contact Us",
welcome:"Welcome",
logout:"Logout",

// Tasks
tasks:"Tasks",
dailyTasks:"Daily Tasks",
availableTasks:"Available Tasks",
completed:"Completed",
dailyProgress:"Daily Progress",
reward:"Reward",
bonus:"Bonus",
todayEarnings:"Today's Earnings",
todayBonus:"Today's Bonus",
completeTask:"Complete Task",
processing:"Processing...",
loading:"Loading...",
completedButton:"✔ Completed",

// Wallet
deposit:"Deposit",
withdraw:"Withdraw",
history:"History",
submit:"Submit",
cancel:"Cancel",
save:"Save",

// Common
language:"Language",
settings:"Settings",
support:"Support",
telegram:"Telegram",
back:"Back",
next:"Next"

},

am:{
    
loading:"በመጫን ላይ...",
referralCode:"የሪፈራል ኮድ",
contactUs:"አግኙን",
currency:"ብር",
dailyWelcomeBonus:"የዕለቱ የእንኳን ደህና መጡ ጉርሻ",
loginRequired:"እባክዎ መጀመሪያ ይግቡ።",
sessionExpired:"ክፍለ ጊዜው አልቋል። እባክዎ እንደገና ይግቡ።",
serverError:"ከሰርቨሩ ጋር መገናኘት አልተቻለም።",
dashboard:"ዳሽቦርድ",
home:"መነሻ",
profile:"መገለጫ",
orders:"ትዕዛዞች",
deposits:"ገንዘብ ማስገባት",
withdrawal:"ገንዘብ ማውጣት",
wallet:"ቦርሳ",
balance:"ቀሪ ሂሳብ",
availableBalance:"ያለ ቀሪ ሂሳብ",
referralCode:"የሪፈራል ኮድ",
vipLevel:"VIP ደረጃ",
upgradeLevel:"ደረጃ አሻሽል",
learnMore:"ተጨማሪ መረጃ",
aboutUs:"ስለ እኛ",
contactUs:"ያግኙን",
welcome:"እንኳን ደህና መጡ",
logout:"ውጣ",

tasks:"ተግባሮች",
dailyTasks:"የዕለቱ ተግባሮች",
availableTasks:"ያሉ ተግባሮች",
completed:"ተጠናቋል",
dailyProgress:"የዛሬ ሂደት",
reward:"ሽልማት",
bonus:"ቦነስ",
todayEarnings:"የዛሬ ገቢ",
todayBonus:"የዛሬ ቦነስ",
completeTask:"ተግባሩን ጨርስ",
processing:"በሂደት ላይ...",
loading:"በመጫን ላይ...",
completedButton:"✔ ተጠናቋል",

deposit:"ገንዘብ አስገባ",
withdraw:"ገንዘብ አውጣ",
history:"ታሪክ",
submit:"ላክ",
cancel:"ሰርዝ",
save:"አስቀምጥ",

language:"ቋንቋ",
settings:"ቅንብሮች",
support:"ድጋፍ",
telegram:"ቴሌግራም",
back:"ተመለስ",
next:"ቀጣይ"

},

om:{

loading:"Fe'amaa jira...",
referralCode:"Koodii Affeerraa",
contactUs:"Nu Qunnamaa",
currency:"ETB",
dailyWelcomeBonus:"Bonaasii Guyyaa",
loginRequired:"Mee dura seeni.",
sessionExpired:"Yeroon xumurameera. Mee irra deebi'ii seeni.",
serverError:"Sarvaratti wal qunnamuun hin danda'amne.",
dashboard:"Daashboordii",
home:"Mana",
profile:"Piroofaayilii",
orders:"Ajajawwan",
deposits:"Kuusaa",
withdrawal:"Baasii",
wallet:"Baankii",
balance:"Hafee",
availableBalance:"Hafee Herregaa",
referralCode:"Koodii Affeerraa",
vipLevel:"Sadarkaa VIP",
upgradeLevel:"Sadarkaa Ol Kaasi",
learnMore:"Caalaatti Baradhu",
aboutUs:"Waa'ee Keenya",
contactUs:"Nu Qunnamaa",
welcome:"Baga Nagaan Dhufte",
logout:"Ba'i",

tasks:"Hojiiwwan",
dailyTasks:"Hojii Guyyaa",
availableTasks:"Hojiiwwan Jiran",
completed:"Xumurameera",
dailyProgress:"Adeemsa Har'aa",
reward:"Badhaasa",
bonus:"Boonaasii",
todayEarnings:"Galii Har'aa",
todayBonus:"Boonaasii Har'aa",
completeTask:"Hojii Xumuri",
processing:"Adeemsa irra jira...",
loading:"Fe'amaa jira...",
completedButton:"✔ Xumurameera",

deposit:"Kuusi",
withdraw:"Baasi",
history:"Seenaa",
submit:"Ergi",
cancel:"Dhiisi",
save:"Olkaa'i",

language:"Afaan",
settings:"Qindaa'ina",
support:"Deeggarsa",
telegram:"Telegram",
back:"Duubatti",
next:"Itti Fufi"

}

};

// =======================================
// CURRENT LANGUAGE
// =======================================


function currentLanguage(){
    return localStorage.getItem("language") || "en";
}

function setLanguage(lang){
    localStorage.setItem("language",lang);
    location.reload();
}

function t(key){
    const lang=currentLanguage();
    return LANG[lang]?.[key] || LANG.en[key] || key;
}
// =========================================
// Automatic Translator
// =========================================

function translatePage(){

    const elements=document.querySelectorAll("[data-lang]");

    elements.forEach(function(element){

        const key=element.getAttribute("data-lang");

        if(LANG[currentLanguage()] &&
           LANG[currentLanguage()][key]){

            element.innerHTML=
            LANG[currentLanguage()][key];

        }

    });

}
document.addEventListener("DOMContentLoaded",function(){

    const selector=document.getElementById("languageSelector");

    if(selector){

        selector.value=currentLanguage();

        selector.onchange=function(){

            localStorage.setItem(
                "language",
                this.value
            );

            location.reload();

        };

    }

    translatePage();

});