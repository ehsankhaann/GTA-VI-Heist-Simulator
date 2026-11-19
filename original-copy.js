//So I', developing a GTA VI Heist Simulator, suggested by GPT. I'm developing it on 19th November 2026.

const money = 15000
const gateWayCar = true
const partner = false
const weapon = true

if(money >=10000 && gateWayCar == true && partner == true && weapon == true){
  console.log("Here we go again, Mission can be started! Good Luck!")
}
if(money < 10000){
  console.log("Ah shit, Mission can't be started as you don't have enough money. Poor you xD. Bring atleast $10,000\n")
}
if(!gateWayCar){
  console.log("Are you serious? You wanna go on a heist by walk? Bring a Gate Way Car!\n")
}
if(!partner){
  console.log("Just like life partner is important to SRURVIVE life, crime partner is also important to SUCCEED a heist. Convince your partner!\n")
}
if(!weapon){
  console.log("So you gonna fight there with your dirty punches huh? Go and buy a damn weapon!\n")
}
if(money < 10000 && !gateWayCar && !partner && !weapon){
  console.log("You're going for heist, not on a weekend party! Mission can't be started, bring all necessary things\n")
}