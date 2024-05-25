<template>
    <div class="BJWrapper">
        <div class="formWrapper">
            <div class="BJConnectForm form">
                <h3>User Input</h3>
                <div class="userInput">
                    <label for="uuid">UUID:</label>
                    <input type="text" v-model="uid" id="uuid" maxlength="100" minlength="1" placeholder="UUID" required>
                </div>
                <div class="userInput">
                    <label for="token">TOKEN:</label>
                    <input type="text" v-model="token" id="token" maxlength="100" minlength="1" placeholder="Token" required>
                </div>
                <div class="inputButtons">
                    <button @click="connect" :disabled="!uid || !token" v-if="!liveSignal">Connect</button>
                    <button @click="disconnect" v-else>Disconnect</button>
                    <button @click="subscribe" v-if="liveSignal && room_id === null">Subscribe</button>
                    <button @click="unsubscribe" v-if="liveSignal && room_id !== null">Unsubscribe</button>
                    <button @click="setLocalStorageContent">Save Settings</button>
                </div>
                <div class="info">
                    <h4>- HOW TO -</h4>
                    <p>1. Select currency and bet Size before connecting.</p>
                    <p>2. Go to luckybird.io and once logged in open Developer tools and inside "Application" look for Local Storage.<br/>
                    Inside Local Storage find and copy your uid and token into the inputs above.</p>
                    <p>3. Hit CONNECT and wait a few seconds to get a live signal. (You should see Room id from Statistics table below change value from 0 to another number)</p>
                    <p>4. Hit START.</p>
                    <p>If at any point it randomly stops try using the "STAND" button to see if that can force it to continue.</p>
                </div>
            </div>
            <div class="BJActionsForm form">
                <h3>Parameters</h3>
                <div class="userInput">
                    <label for="currency">CURRENCY:</label>
                    <select name="currency" id="currency" v-model="currency">
                        <option value="gold">Gold Coins</option>
                        <option value="usd" selected>USD</option>
                    </select>
                </div>
                <div class="userInput">
                    <label for="betAmount">BET SIZE:</label>
                    <input type="text" v-model="betAmount" id="betAmount">
                </div>
                <div class="actionButtons">
                    <button @click="start" v-if="!run">Start</button>
                    <button @click="stop" v-else>Stop on next win ({{ stopOnWin }})</button>
                </div>
                <h4>Player Actions</h4>
                <div class="playerButtons">
                    <button @click="handleSendHit">Hit</button>
                    <button @click="handleSendStand">Stand</button>
                    <button @click="handleSendDouble">Double</button>
                    <button @click="handleSendSplit">Split</button>
                    <div class="checkbox">
                      <label for="toogleResetSeed">Reset Seed every bet?</label>
                      <input v-model="resetSeedBoolean" type="checkbox" id="toogleResetSeed"/>
                    </div>
                </div>
                <span class="liveSignal bold" v-if='liveSignal'>Live</span>
                    <span class="reconnectingSignal bold" v-else-if='reconnectingSignal'>Reconnecting</span>
                    <span class="offlineSignal bold" v-else>Offline</span>
            </div>
        </div>
        <div class="stats">
            <h3 class="subtitle">Statsistics</h3>
            <div class="itemBox">
                <div class="statItem">
                    <p>Balance: {{ Number(balance).toFixed(4) }} {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Initial balance: {{ Number(initialBalance).toFixed(4) }}  {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Bet Amount: {{ Number(betAmount).toFixed(4) }} {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Room id: {{ room_id }}</p>
                </div>
                <div class="statItem">
                    <span>Wins: <span :class="winPercentage >= 43 ? 'green' : 'red'">{{ wins }}</span></span>(<span :class="winPercentage >= 43 ? 'green' : 'red'">{{ winPercentage }}%</span><span> Average should be 43%)</span>
                </div>
                <div class="statItem">
                    <p>Highest win streak: {{ highestWinStreak }}</p>
                </div>
                <div class="statItem">
                    <span>Losses: </span><span :class="losePercentage <= 48 ? 'green' : 'red'">{{ losses }}</span>(<span :class="losePercentage <= 48 ? 'green' : 'red'">{{ losePercentage }}%</span><span> Average should be 48%)</span>
                </div>
                <div class="statItem">
                    <p>Highest loosing streak: {{ highestLoosingStreak }}</p>
                </div>
                <div class="statItem">
                    <span>Ties: </span><span :class="tiePercentage <= 8 ? 'green' : 'red'">{{ ties }}</span> (<span :class="tiePercentage <= 8 ? 'green' : 'red'">{{tiePercentage}}%</span><span> Average should be 8%)</span>
                </div>
                <div class="statItem">
                    <p>Doubles made: {{ totalDoubles }}</p>
                </div>
                <div class="statItem">
                    <p>Splits made: {{ totalSplits }}</p>
                </div>
                <div class="statItem">
                    <p>Blackjacks landed: {{ totalBlackJacks }}</p>
                </div>
                <div class="statItem">
                    <p>Total busted Hits: {{ totalBusted }}</p>
                </div>
                <div class="statItem">
                    <p>Bets: {{ totalBets }}</p>
                </div>
                <div class="statItem">
                    <p  :class="profit >= 0 ? 'green' : 'red'">Current profit: {{ Number(profit).toFixed(4) }} {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Highest profit: {{ Number(highestProfit).toFixed(4) }} {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Lowest profit: {{ Number(lowestProfit).toFixed(4) }} {{ currency }}</p>
                </div>
                <div class="statItem">
                    <p>Wager: {{ Number(wager).toFixed(4) }} {{ currency }} ({{ Number((wager / initialBalance)).toFixed(8) }}x)</p>
                </div>
                <div class="statItem">
                    <p  :class="rtp >= 99.5 ? 'green' : 'red'">RTP: {{ Number(rtp).toFixed(4) }}%</p>
                </div>
            </div>
        </div>
        <p class="version">v0.0.6b</p>
    </div>
</template>
<script setup>
/* IMPORTS */
import { v4 as uuidv4 } from 'uuid';
import Paho from "paho-mqtt";
import Fingerprint2 from 'fingerprintjs2';
import { generateFingerprint } from '~/composables/utils';


/* VARIABLES */
const uid = ref(null),
     token = ref(null),
  currency = ref("usd"),
   betAmount = ref(null),
   balance = ref(null),
   initialBalance = ref(null),
   room_id = ref(null),
   liveSignal = ref(false),
   reconnectingSignal = ref(false),
   fingerprint = ref(null),
   destination = '/n',
   run = ref(false),
   dealerCards = ref(null),
   dealerPoints = ref(null),
   playerCards = ref(null),
   playerPoints = ref(null),
   timeoutBet = 5,
   profit = ref(0),
   wager = ref(null),
   losses = ref(0),
   wins = ref(0),
   ties = ref(0),
   winPercentage = ref(null),
   losePercentage = ref(null),
   tiePercentage = ref(null),
   action = ref(null),
   actions = ref(null),
   hasSplit = ref(false),
   hasSplitAces = ref(false),
   stopOnWin = ref(false),
   currentHand = ref(0),
   highestWinStreak = ref(0),
   highestLoosingStreak = ref(0),
   currentWinStreak = ref(0),
   currentLoseStreak = ref(0),
   highestProfit = ref(0),
   totalBets = ref(0),
   lowestProfit = ref(0),
   totalDoubles = ref(0),
   totalSplits = ref(0),
   totalBlackJacks = ref(0),
   totalBusted = ref(0),
   timeout = ref(null),
   timeoutDuration = 15000,
   timeoutCounter = ref(0),
   resetSeedBoolean = ref(false),
   rtp = ref(0),
   url = 'luckybird.io',
   client = ref(null);

/* ACTIONS */

const connect = () => {
    client.value = new LuckyBirdClient(url);
    
    client.value.connect({
        onSuccess: () => {
            console.log("Connected successfully");
        },
        onFailure: (err) => {
            console.error("Connection failed: ", err);
        }
    });
};

const start = () => {
    run.value = true;
    client.value.start();
};

const disconnect = () => {
    run.value = false;
    client.value.disconnect();
};

const stop = () => {
    client.value.stop();
};

const handleSendHit = () => {
    client.value.hit();
}

const handleSendStand = () => {
    client.value.stand();
}

const handleSendSplit = () => {
    client.value.split();
}

const handleSendDouble = () => {
    client.value.double();
}

// CLASS

class LuckyBirdClient {
    constructor(url) {
        this.gameData = null;
        this.client = new Paho.Client(url, 443, uuidv4());
        this.client.onConnectionLost = (event) => { this.handleOnConnectionLost(event) };
        this.client.onMessageArrived = (event) => { this.handleOnMessageArrived(event) };
        this.client.onMessageDelivered = (event) => { this.handleOnMessageDelivered(event) };
    }

    sendRequest(data) {
        let message = new Paho.Message(JSON.stringify(data));
        message.destinationName = destination;
        setTimeout(this.client.send(message), timeoutBet.value * 1e3);
    }

    connect() {
        console.log('Attempting to connect to WebSocket Server...');
        reconnectingSignal.value = true;
        const options = {
            useSSL: true,
            timeout: 10,
            onSuccess: () => {
                console.log('[LuckyBird] connected');
                timeout.value = setTimeout(() => this.handleTimeout(), timeoutDuration);
                this.subscribe();
            },
            onFailure: (message) => {
                console.log('Failed to connect');
                liveSignal.value = false;
                console.log(message);
            },
        };

        this.client.connect(options);
    }

    initialConnect() {
        try {
            const timestamp = Date.parse(new Date());
            let key = token.value + 'luckybird' + timestamp;
            key = generateKey(key).substring(0, 8);

            const data = {
                code: 3012,
                data: {
                    is_room: false,
                    fingerprint: fingerprint.value,
                    domain: 'luckybird.io',
                    device: 'pc',
                    timestamp,
                    key
                },
                uid: uid.value,
                token: token.value
            };
            this.sendRequest(data);
        } catch (error) {
            console.log('Failed to connect.');
            console.log(error);
        }
    }

    subscribe() {
        console.log('Attempting to subscribe...');
        this.client.subscribe(destination, {
            qos: 1,
            onSuccess: () => {
                console.log('Successfully subscribed.');
                Fingerprint2.get({}, (components) => {
                    const values = components.map((component) => {
                        if (
                            component.key === 'canvas' ||
                            component.key === 'webgl' ||
                            component.key === 'fonts'
                        ) {
                            component.value = generateHash(component.value);
                        }
                        return component.value;
                    });
                    fingerprint.value = generateFingerprint(values);
                    setTimeout(this.initialConnect(), 5000);
                });
            },
            onFailure: (error) => {
                console.log('Failed to subscribe');
                console.log(error);
            }
        });
    }

    unsubscribe() {
        console.log('Attempting to unsibscribe...');
        const options = {
            onSuccess: () => {
                console.log('Unsubscribed');
                room_id.value = null;
            },
            onFailure: () => {
                console.log('Failed to unsubscribe');
            }
        };
        this.client.unsubscribe(destination, options);
    }

    disconnect() {
        console.log('Attempting to disconnect...');
        try {
            this.client.disconnect();
        } catch (error) {
            console.log('Failed to disconnect');
            console.log(error);
        }
    }

    resetSeed() {
      const data = {
            code: 4037,
            data: {
                room_id: room_id.value,
                client_seed: this.randomString(),
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    start() {
        const data = {
            code: 4701,
            data: {
                amount: betAmount.value,
                currency: String(currency.value).toLowerCase(),
                room_id: room_id.value,
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    stop() {
        stopOnWin.value = true;
        if (timeout.value) {
            clearTimeout(timeout.value);
        }
    }

    handleInitial() {
        console.log("Handling Initial");
        const wallets = this.gameData.data.player.balances;
        for (const item in wallets) {
            if (item === String(currency.value).toLowerCase()) {
                balance.value = Number(wallets[item].amount);
                if (initialBalance.value === null) {
                    initialBalance.value = balance.value;
                    console.log(`Initial Balance: ${initialBalance.value} ${currency.value}`);
                }

                const data = {
                    code: 3022,
                    data: {
                        game_name: "blackJack",
                    },
                    uid: uid.value,
                    token: token.value,
                };

                this.sendRequest(data);
            }
        }
    }

    hit() {
        const data = {
            code: 4703,
            data: {
                room_id: room_id.value,
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    stand() {
        const data = {
            code: 4704,
            data: {
                room_id: room_id.value,
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    split() {
        const data = {
            code: 4705,
            data: {
                room_id: room_id.value,
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    double() {
        const data = {
            code: 4706,
            data: {
                room_id: room_id.value,
            },
            uid: uid.value,
            token: token.value,
        };
        this.sendRequest(data);
    }

    handleOnMessageArrived(message) {
        try {
            const decoder = new TextDecoder('utf-8');
            this.gameData = decoder.decode(message.payloadBytes);
            this.gameData = this.gameData
            .replace(/\u0000/, "")
            .replace(/[/]/, "")
            .replace(/'/g, '"');

            const index = this.gameData.indexOf('{');
            this.gameData = this.gameData.slice(index, this.gameData.length);
            this.gameData = JSON.parse(this.gameData);

            if (![2250, 3121, 3013, 3030, 3409, 3512, 3572, 3580, 3590, 3944, 4021, 4031, 4033].includes(this.gameData.code)) console.log(this.gameData);

            switch (this.gameData.code) {
                case 3012:
                    this.handleInitial();
                    break;
                case 3022:
                    this.handleCheckConnectedToRoom();
                    break;
                case 4037:
                    console.log('New Seed generated.');
                    break;
                case 4701:
                    console.log('------INITIAL-------');
                    if (run.value) this.handleResult();
                    break;
                case 4703:
                    console.log('------HIT-------');
                    this.handleResult();
                    break;
                case 4704:
                    console.log('------STAND-------');
                    if (hasSplit.value && currentHand.value === 0) currentHand.value = 1;
                    else return;
                    this.handleResult();
                    break;
                case 4705:
                    console.log('------SPLIT-------');
                    if (hasSplitAces.value) return;
                    hasSplit.value = true;
                    totalSplits.value++;
                    this.handleResult();
                    break;
                case 4706:
                    console.log('------DOUBLE-------');
                    totalDoubles.value++;
                    if (hasSplit.value && currentHand.value === 0) currentHand.value = 1;
                    else return;
                    this.handleResult();
                    break;
                case 4707:
                    console.log('------END-------');
                    if (this.gameData.data.msg) console.log(this.gameData.data.msg);
                    if (this.gameData.data.msg) {
                        console.log("MISTAKE");
                        console.log(this.gameData.data.msg);
                        return;
                    }
                    this.handleEndRound();
                    break;
            }
        } catch(error) {
            console.log(error);
        }
    }

    handleOnConnectionLost(error) {
        liveSignal.value = false;
        if (error.errorCode === 0) {
                console.log("Successfully disconnected.");
            } else {
                console.log("Connection lost with error:");
                console.log(error);
                console.log("Attempting to reconnect...");
                reconnectingSignal.value = true;
                this.connect();
            }
    }

    handleOnMessageDelivered(message) {
        console.log("SENT MESSAGE");
        console.log(message);
        clearTimeout(timeout.value);
        timeout.value = setTimeout(() => this.handleTimeout(), timeoutDuration);
    }

    handleCheckConnectedToRoom() {
        if (this.gameData.errCode === -1) {
            console.log('The game is under maintenance.');
            return this.disconnect();
        } else {
            room_id.value = this.gameData.data.room_id;
            console.log(`Connected to BJ room #${room_id.value}.`);
            liveSignal.value = true;
            reconnectingSignal.value = false;
        }
    }

    handleResult() {
        // Check if error
        if (this.gameData.data.errcode !== 0) {
            console.log('Error from last action.');
            return;
        }

        if (this.gameData.data.blackjack) this.calculateHandAndPoints();

        if (dealerCards.value[0].value === 'A') {
            console.log("INSURANCE OFFERED");
            if (playerPoints.value[0] === 21) {
              console.log("Standing on 11 vs 21.");
              return this.stand();
            }
        }

        // Check if split
        if (playerCards.value.length > 1 && hasSplit.value) return this.handleSplitResult();
        
        // Check for BlackJack or 21
        if (playerPoints.value[currentHand.value] === 21) {
            if (playerCards.value[0].length === 2) {
                console.log('Landed blackjack');
                totalBlackJacks.value++;
            } else {
                console.log('Won hand with 21.');
            }
            return;
        }

        // Check for busted hand.
        if (playerPoints.value[currentHand.value] > 21) {
            console.log('Busted hand');
            totalBusted.value++;
            return;
        }

        let sameCard;

        if (playerCards.value[0][0].value === 'A' && playerCards.value[0][1].value === 'A') {
            hasSplitAces.value = true;
            return this.split();
        }

        const pHaveA = this.hasAceWithValue(playerCards.value[0]);
        
        const many = playerCards.value[0].length;
        
        if (playerCards.value[0][0].value === playerCards.value[0][1].value && many < 3) sameCard = true;

        if (sameCard) {
            actions.value = ['H', 'S', 'D', 'P'];
        } else if (many > 2) {
            actions.value = ['H', 'S'];
        } else {
            actions.value = ['H', 'S', 'D'];
        }

        return this.handleNextAction(sameCard, pHaveA);
    }

    handleSplitResult() {
        console.log('Hand chosen: ', currentHand.value);

        let currentPlayerHand = playerCards.value[currentHand.value];

        if (currentPlayerHand.value === 21) {
            if (currentPlayerHand.cards.length > 1) {
                console.log(`Landed 21 on ${currentHand.value === 0 ? 'first hand' : 'second hand'}.`);
            } else {
                console.log(`Landed blackjack on ${currentHand.value === 0 ? 'first hand' : 'second hand'}.`);
            }

            if (currentHand.value === 0) {
                currentHand.value = 1;
                return this.handleSplitResult();
            } else {
                return this.handleEndRound();
            }
        } else if (currentPlayerHand.value > 21) {
            console.log(`Busted ${currentHand.value === 0 ? 'first hand' : 'second hand'}.`);

            if (currentHand.value === 0) {
                currentHand.value = 1;
                return this.handleSplitResult();
            } else {
                return this.handleEndRound();
            }
        }
        
        const many = playerCards.value[currentHand.value].length;

        const pHaveA = this.hasAceWithValue(playerCards.value[currentHand.value]);

        if (many > 2) {
            actions.value = ['H', 'S'];
        } else {
            actions.value = ['H', 'S', 'D'];
        }

        return this.handleNextAction(null, pHaveA)
    }

    handleNextAction(sameCard, pHaveA) {
        console.log(playerPoints.value);
        console.log(playerPoints.value[0]);
        console.log(`D ${dealerPoints.value} vs P ${playerPoints.value[currentHand.value]}, ${sameCard}, ${pHaveA}`);

        action.value = null;

        if (sameCard) {
            console.log('Split Script');
            splitScript().map((item) => {
                if (item.point.join() === `${dealerPoints.value},${playerPoints.value[currentHand.value]}`) {
                    action.value = item.action;
                    return;
                }
            });
        } else if (pHaveA) {
            console.log('Soft Script');
            softScript().map((item) => {
                if (item.point.join() === `${dealerPoints.value},${playerPoints.value[currentHand.value]}`) {
                    action.value = item.action;
                    return;
                }
            });
        } else {
            console.log('Hard Script');
            hardScript().map((item) => {
                if (item.point.join() === `${dealerPoints.value},${playerPoints.value[currentHand.value]}`) {
                    action.value = item.action;
                    return;
                }
            });
        }

        if (!action.value) action.value = 'H';

        const index = actions.value.find((item) => item === action.value);

        if (!index && action.value === 'D') {
            console.log('Cannot double so will hit');
            action.value = 'H';
        } else if (!index && action.value == 'Ds') {
            console.log('Cannot double so will stand');
            action.value = 'S';
        } else if (!index) action.value = 'S';

        console.log('Next Action: ', action.value);

        switch (action.value) {
            case 'S':
                this.stand()
                break;
            case 'H':
                this.hit();
                break;
            case 'P':
                this.split();
                break;
            case 'D':
                this.double();
                break;
        };
    };

    handleEndRound() {
        // Wager
        let totalBetAmount = Number(this.gameData.data.bet.amount);
        wager.value += totalBetAmount;

        // Profit{
        let payout = Number(this.gameData.data.bet.payout);
        profit.value += payout;
        balance.value = this.gameData.data.user.balances[currency.value].amount;
        let trueProfit = balance.value - initialBalance.value;
        if (payout > 0) {
            wins.value++;
            currentWinStreak.value++;
            currentLoseStreak.value = 0;
            if (currentWinStreak.value > highestWinStreak.value) highestWinStreak.value = currentWinStreak.value;
        } else if (payout === 0) {
            ties.value++;
            currentWinStreak.value = 0;
            currentLoseStreak.value = 0;
        } else {
            losses.value++;
            currentLoseStreak.value++;
            currentWinStreak.value = 0;
            if (currentLoseStreak.value > highestLoosingStreak.value) highestLoosingStreak.value = currentLoseStreak.value;
        }

        
        // RTP and Percentages
        rtp.value = wager.value ? 100 + (profit.value / wager.value) * 100 : 0;
        totalBets.value++;
        const calculatePercentage = (part) => ((part / totalBets.value) * 100).toFixed(2);
        winPercentage.value = calculatePercentage(wins.value);
        losePercentage.value = calculatePercentage(losses.value);
        tiePercentage.value = calculatePercentage(ties.value);
        
        
        // Logs
        console.log(`Bet amount:      ${betAmount.value} ${currency.value}`);
        console.log(`Total bet:       ${totalBetAmount} ${currency.value}`);
        console.log(`Wager:           ${wager.value.toFixed(4)} ${currency.value} (${(wager.value / initialBalance.value).toFixed(2)}x)`);
        console.log(`Round profit:    ${payout.toFixed(4)} ${currency.value}`);
        console.log(`True profit:     ${trueProfit.toFixed(4)} ${currency.value}`);
        console.log(`Total profit:    ${profit.value.toFixed(4)} ${currency.value}`);
        console.log(`Wins:            ${wins.value} (${winPercentage.value}% Average should be 43%)`);
        console.log(`Losses:          ${losses.value} (${losePercentage.value}% Average should be 48%)`);
        console.log(`Ties:            ${ties.value} (${tiePercentage.value}% Average should be 8%)`);
        console.log(`RTP:             ${rtp.value.toFixed(2)} %`);
        console.log(`Bets made:       ${totalBets.value}`);
        console.log(`Initial balance: ${initialBalance.value} ${currency.value}`);
        console.log(`Balance:         ${balance.value} ${currency.value}`);

        // Reset variables
        playerCards.value = null;
        dealerCards.value = null;
        playerPoints.value = null;
        dealerPoints.value = null;
        hasSplit.value = false;
        hasSplitAces.value = false;
        currentHand.value = 0;
        timeoutCounter.value = 0;

        if (profit.value > highestProfit.value) {
            highestProfit.value = profit.value;
        }
        if (profit.value < lowestProfit.value) {
            lowestProfit.value = profit.value;
        }

        if (resetSeedBoolean.value) {
          console.log('Attempting to reset seed.');
          this.resetSeed();
        }

        if (stopOnWin.value) {
            stopOnWin.value = false;
            run.value = false;
            return;
        } else {
            return this.start();
        }
    }

    handleTimeout() {
        console.log('No message received for ' + (timeoutDuration / 1000) + ' seconds.');
        timeoutCounter.value++;
        if (timeoutCounter.value == 2) {
            console.log('Did not accept start, will attempt to stand.');
            if (run.value) return this.stand();
        } else if (timeoutCounter.value >= 3) return this.stop();
        if (run.value) return this.start();
    }

    calculateHandAndPoints() {
        dealerCards.value = this.gameData.data.blackjack.dealer[0].cards.map((item) => {return this.findCard(item)});
        dealerPoints.value = this.gameData.data.blackjack.dealer[0].value;
        playerCards.value = this.gameData.data.blackjack.player.map(hands => hands.cards.map((item) => {return this.findCard(item)}));
        playerPoints.value = this.gameData.data.blackjack.player.map(hands => hands.value);

        this.printHand(`(${dealerPoints.value}) Dealer hand`, dealerCards.value);
        this.printHand(`(${playerPoints.value[0]}) Player hand 1`, playerCards.value[0]);
        if (playerCards.value.length > 1) this.printHand(`(${playerPoints.value[1]}) Player hand 1`, playerCards.value[1]);
    }

    printHand(title, cards) {
        let hand = `${title}: `;
        for (let i = 0; i < cards.length; i++) {
            hand += `${cards[i].value} ${cards[i].icon} | `;
        }
        console.log(hand);
    }

    hasAceWithValue(cards) {
        let totalPoints = 0;
        let aceCount = 0;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            let number = card.value === 'A' ? 1 : (card.value === 'K' || card.value === 'Q' || card.value === 'J') ? 10 : Number(card.value); 
            console.log(card);
            console.log(number);
            if (number === 1) {
                totalPoints++;
                aceCount++;
            } else {
                totalPoints += number;
            }
        }

        if (aceCount > 0 && totalPoints + 10 <= 21) {
            return true;
        }

        return false;
    }

    randomChar() {
      const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const randomIndex = Math.floor(Math.random() * charSet.length);
      return charSet[randomIndex];
    }

    randomString() {
      const length = Math.floor(Math.random() * 7) + 6;
      let result = '';
      for (let i = 0; i < length; i++) {
          result += this.randomChar();
      }
      return result;
    }

    findCard = (card) => {
        const typeCard = [
            {
                type: 1,
                icon: "♦",
              },
              {
                type: 2,
                icon: "♥",
              },
              {
                type: 3,
                icon: "♠️",
              },
              {
                type: 4,
                icon: "♣",
              },
        ];
    
        const cardList = [
            {
              type: 1,
              name: "A",
            },
            {
              type: 2,
              name: "2",
            },
            {
              type: 3,
              name: "3",
            },
            {
              type: 4,
              name: "4",
            },
            {
              type: 5,
              name: "5",
            },
            {
              type: 6,
              name: "6",
            },
            {
              type: 7,
              name: "7",
            },
            {
              type: 8,
              name: "8",
            },
            {
              type: 9,
              name: "9",
            },
            {
              type: 10,
              name: "10",
            },
            {
              type: 11,
              name: "J",
            },
            {
              type: 12,
              name: "Q",
            },
            {
              type: 13,
              name: "K",
            },
          ];
    
          let n, t;
    
          cardList.map((item) => {
            if (item.type === card.number) n = item.name;
          });
    
          typeCard.map((item) => {
            if (item.type === card.type) t = item.icon;
          });
    
          return { value: n, icon: t };
    }

    splitScript() {
        return [
            {
                point: [2, 4],
                action: "P",
              },
              {
                point: [2, 6],
                action: "P",
              },
              {
                point: [2, 8],
                action: "H",
              },
              {
                point: [2, 10],
                action: "D",
              },
              {
                point: [2, 12],
                action: "P",
              },
              {
                point: [2, 14],
                action: "P",
              },
              {
                point: [2, 16],
                action: "P",
              },
              {
                point: [2, 18],
                action: "P",
              },
              {
                point: [2, 20],
                action: "S",
              },
              {
                point: [2, 22],
                action: "P",
              },
              {
                point: [3, 4],
                action: "P",
              },
              {
                point: [3, 6],
                action: "P",
              },
              {
                point: [3, 8],
                action: "H",
              },
              {
                point: [3, 10],
                action: "D",
              },
              {
                point: [3, 12],
                action: "P",
              },
              {
                point: [3, 14],
                action: "P",
              },
              {
                point: [3, 16],
                action: "P",
              },
              {
                point: [3, 18],
                action: "P",
              },
              {
                point: [3, 20],
                action: "S",
              },
              {
                point: [3, 22],
                action: "P",
              },
              {
                point: [4, 4],
                action: "P",
              },
              {
                point: [4, 6],
                action: "P",
              },
              {
                point: [4, 8],
                action: "H",
              },
              {
                point: [4, 10],
                action: "D",
              },
              {
                point: [4, 12],
                action: "P",
              },
              {
                point: [4, 14],
                action: "P",
              },
              {
                point: [4, 16],
                action: "P",
              },
              {
                point: [4, 18],
                action: "P",
              },
              {
                point: [4, 20],
                action: "S",
              },
              {
                point: [4, 22],
                action: "P",
              },
              {
                point: [5, 4],
                action: "P",
              },
              {
                point: [5, 6],
                action: "P",
              },
              {
                point: [5, 8],
                action: "P",
              },
              {
                point: [5, 10],
                action: "D",
              },
              {
                point: [5, 12],
                action: "P",
              },
              {
                point: [5, 14],
                action: "P",
              },
              {
                point: [5, 16],
                action: "P",
              },
              {
                point: [5, 18],
                action: "P",
              },
              {
                point: [5, 20],
                action: "S",
              },
              {
                point: [5, 22],
                action: "P",
              },
              {
                point: [6, 4],
                action: "P",
              },
              {
                point: [6, 6],
                action: "P",
              },
              {
                point: [6, 8],
                action: "P",
              },
              {
                point: [6, 10],
                action: "D",
              },
              {
                point: [6, 12],
                action: "P",
              },
              {
                point: [6, 14],
                action: "P",
              },
              {
                point: [6, 16],
                action: "P",
              },
              {
                point: [6, 18],
                action: "P",
              },
              {
                point: [6, 20],
                action: "S",
              },
              {
                point: [6, 22],
                action: "P",
              },
              {
                point: [7, 4],
                action: "P",
              },
              {
                point: [7, 6],
                action: "P",
              },
              {
                point: [7, 8],
                action: "H",
              },
              {
                point: [7, 10],
                action: "D",
              },
              {
                point: [7, 12],
                action: "H",
              },
              {
                point: [7, 14],
                action: "P",
              },
              {
                point: [7, 16],
                action: "P",
              },
              {
                point: [7, 18],
                action: "S",
              },
              {
                point: [7, 20],
                action: "S",
              },
              {
                point: [7, 22],
                action: "P",
              },
              {
                point: [8, 4],
                action: "H",
              },
              {
                point: [8, 6],
                action: "H",
              },
              {
                point: [8, 8],
                action: "H",
              },
              {
                point: [8, 10],
                action: "D",
              },
              {
                point: [8, 12],
                action: "H",
              },
              {
                point: [8, 14],
                action: "H",
              },
              {
                point: [8, 16],
                action: "P",
              },
              {
                point: [8, 18],
                action: "P",
              },
              {
                point: [8, 20],
                action: "S",
              },
              {
                point: [8, 22],
                action: "P",
              },
              {
                point: [9, 4],
                action: "H",
              },
              {
                point: [9, 6],
                action: "H",
              },
              {
                point: [9, 8],
                action: "H",
              },
              {
                point: [9, 10],
                action: "D",
              },
              {
                point: [9, 12],
                action: "H",
              },
              {
                point: [9, 14],
                action: "H",
              },
              {
                point: [9, 16],
                action: "P",
              },
              {
                point: [9, 18],
                action: "P",
              },
              {
                point: [9, 20],
                action: "S",
              },
              {
                point: [9, 22],
                action: "P",
              },
              {
                point: [10, 4],
                action: "H",
              },
              {
                point: [10, 6],
                action: "H",
              },
              {
                point: [10, 8],
                action: "H",
              },
              {
                point: [10, 10],
                action: "H",
              },
              {
                point: [10, 12],
                action: "H",
              },
              {
                point: [10, 14],
                action: "H",
              },
              {
                point: [10, 16],
                action: "P",
              },
              {
                point: [10, 18],
                action: "S",
              },
              {
                point: [10, 20],
                action: "S",
              },
              {
                point: [10, 22],
                action: "P",
              },
              {
                point: [11, 4],
                action: "H",
              },
              {
                point: [11, 6],
                action: "H",
              },
              {
                point: [11, 8],
                action: "H",
              },
              {
                point: [11, 10],
                action: "H",
              },
              {
                point: [11, 12],
                action: "H",
              },
              {
                point: [11, 14],
                action: "H",
              },
              {
                point: [11, 16],
                action: "P",
              },
              {
                point: [11, 18],
                action: "S",
              },
              {
                point: [11, 20],
                action: "S",
              },
              {
                point: [11, 22],
                action: "P",
              },
        ];
    }
    
    softScript() {
        return [
            {
            point: [2, 13],
            action: "H",
            },
            {
            point: [2, 14],
            action: "H",
            },
            {
            point: [2, 15],
            action: "H",
            },
            {
            point: [2, 16],
            action: "H",
            },
            {
            point: [2, 17],
            action: "H",
            },
            {
            point: [2, 18],
            action: "S",
            },
            {
            point: [2, 19],
            action: "S",
            },
            {
            point: [2, 20],
            action: "S",
            },
            {
            point: [2, 21],
            action: "S",
            },
            {
            point: [3, 13],
            action: "H",
            },
            {
            point: [3, 14],
            action: "H",
            },
            {
            point: [3, 15],
            action: "H",
            },
            {
            point: [3, 16],
            action: "H",
            },
            {
            point: [3, 17],
            action: "D",
            },
            {
            point: [3, 18],
            action: "Ds",
            },
            {
            point: [3, 19],
            action: "S",
            },
            {
            point: [3, 20],
            action: "S",
            },
            {
            point: [3, 21],
            action: "S",
            },
            {
            point: [4, 13],
            action: "S",
            },
            {
            point: [4, 14],
            action: "S",
            },
            {
            point: [4, 15],
            action: "S",
            },
            {
            point: [4, 16],
            action: "D",
            },
            {
            point: [4, 17],
            action: "D",
            },
            {
            point: [4, 18],
            action: "Ds",
            },
            {
            point: [4, 19],
            action: "S",
            },
            {
            point: [4, 20],
            action: "S",
            },
            {
            point: [4, 21],
            action: "S",
            },
            {
            point: [5, 13],
            action: "H",
            },
            {
            point: [5, 14],
            action: "D",
            },
            {
            point: [5, 15],
            action: "D",
            },
            {
            point: [5, 16],
            action: "D",
            },
            {
            point: [5, 17],
            action: "D",
            },
            {
            point: [5, 18],
            action: "Ds",
            },
            {
            point: [5, 19],
            action: "S",
            },
            {
            point: [5, 20],
            action: "S",
            },
            {
            point: [5, 21],
            action: "S",
            },
            {
            point: [6, 13],
            action: "D",
            },
            {
            point: [6, 14],
            action: "D",
            },
            {
            point: [6, 15],
            action: "D",
            },
            {
            point: [6, 16],
            action: "D",
            },
            {
            point: [6, 17],
            action: "D",
            },
            {
            point: [6, 18],
            action: "Ds",
            },
            {
            point: [6, 19],
            action: "S",
            },
            {
            point: [6, 20],
            action: "S",
            },
            {
            point: [6, 21],
            action: "S",
            },
            {
            point: [7, 13],
            action: "H",
            },
            {
            point: [7, 14],
            action: "H",
            },
            {
            point: [7, 15],
            action: "H",
            },
            {
            point: [7, 16],
            action: "H",
            },
            {
            point: [7, 17],
            action: "H",
            },
            {
            point: [7, 18],
            action: "S",
            },
            {
            point: [7, 19],
            action: "S",
            },
            {
            point: [7, 20],
            action: "S",
            },
            {
            point: [7, 21],
            action: "S",
            },
            {
            point: [8, 13],
            action: "H",
            },
            {
            point: [8, 14],
            action: "H",
            },
            {
            point: [8, 15],
            action: "H",
            },
            {
            point: [8, 16],
            action: "H",
            },
            {
            point: [8, 17],
            action: "H",
            },
            {
            point: [8, 18],
            action: "S",
            },
            {
            point: [8, 19],
            action: "S",
            },
            {
            point: [8, 20],
            action: "S",
            },
            {
            point: [8, 21],
            action: "S",
            },
            {
            point: [9, 13],
            action: "H",
            },
            {
            point: [9, 14],
            action: "H",
            },
            {
            point: [9, 15],
            action: "H",
            },
            {
            point: [9, 16],
            action: "H",
            },
            {
            point: [9, 17],
            action: "H",
            },
            {
            point: [9, 18],
            action: "H",
            },
            {
            point: [9, 19],
            action: "S",
            },
            {
            point: [9, 20],
            action: "S",
            },
            {
            point: [9, 21],
            action: "S",
            },
            {
            point: [10, 13],
            action: "H",
            },
            {
            point: [10, 14],
            action: "H",
            },
            {
            point: [10, 15],
            action: "H",
            },
            {
            point: [10, 16],
            action: "H",
            },
            {
            point: [10, 17],
            action: "H",
            },
            {
            point: [10, 18],
            action: "H",
            },
            {
            point: [10, 19],
            action: "S",
            },
            {
            point: [10, 20],
            action: "S",
            },
            {
            point: [10, 21],
            action: "S",
            },
            {
            point: [11, 13],
            action: "H",
            },
            {
            point: [11, 14],
            action: "H",
            },
            {
            point: [11, 15],
            action: "H",
            },
            {
            point: [11, 16],
            action: "H",
            },
            {
            point: [11, 17],
            action: "H",
            },
            {
            point: [11, 18],
            action: "H",
            },
            {
            point: [11, 19],
            action: "S",
            },
            {
            point: [11, 20],
            action: "S",
            },
            {
            point: [11, 21],
            action: "S",
            },
        ]
    }
    
    hardScript() {
        return [
            {
                point: [2, 4],
                action: "H",
              },
              {
                point: [2, 5],
                action: "H",
              },
              {
                point: [2, 6],
                action: "H",
              },
              {
                point: [2, 7],
                action: "H",
              },
              {
                point: [2, 8],
                action: "H",
              },
              {
                point: [2, 9],
                action: "H",
              },
              {
                point: [2, 10],
                action: "D",
              },
              {
                point: [2, 11],
                action: "D",
              },
              {
                point: [2, 12],
                action: "H",
              },
              {
                point: [2, 13],
                action: "S",
              },
              {
                point: [2, 14],
                action: "S",
              },
              {
                point: [2, 15],
                action: "S",
              },
              {
                point: [2, 16],
                action: "S",
              },
              {
                point: [2, 17],
                action: "S",
              },
              {
                point: [2, 18],
                action: "S",
              },
              {
                point: [2, 19],
                action: "S",
              },
              {
                point: [2, 20],
                action: "S",
              },
              {
                point: [2, 21],
                action: "S",
              },
              {
                point: [3, 4],
                action: "H",
              },
              {
                point: [3, 5],
                action: "H",
              },
              {
                point: [3, 6],
                action: "H",
              },
              {
                point: [3, 7],
                action: "H",
              },
              {
                point: [3, 8],
                action: "H",
              },
              {
                point: [3, 9],
                action: "D",
              },
              {
                point: [3, 10],
                action: "D",
              },
              {
                point: [3, 11],
                action: "D",
              },
              {
                point: [3, 12],
                action: "H",
              },
              {
                point: [3, 13],
                action: "S",
              },
              {
                point: [3, 14],
                action: "S",
              },
              {
                point: [3, 15],
                action: "S",
              },
              {
                point: [3, 16],
                action: "S",
              },
              {
                point: [3, 17],
                action: "S",
              },
              {
                point: [3, 18],
                action: "S",
              },
              {
                point: [3, 19],
                action: "S",
              },
              {
                point: [3, 20],
                action: "S",
              },
              {
                point: [3, 21],
                action: "S",
              },
              {
                point: [4, 4],
                action: "H",
              },
              {
                point: [4, 5],
                action: "H",
              },
              {
                point: [4, 6],
                action: "H",
              },
              {
                point: [4, 7],
                action: "H",
              },
              {
                point: [4, 8],
                action: "H",
              },
              {
                point: [4, 9],
                action: "D",
              },
              {
                point: [4, 10],
                action: "D",
              },
              {
                point: [4, 11],
                action: "D",
              },
              {
                point: [4, 12],
                action: "S",
              },
              {
                point: [4, 13],
                action: "S",
              },
              {
                point: [4, 14],
                action: "S",
              },
              {
                point: [4, 15],
                action: "S",
              },
              {
                point: [4, 16],
                action: "S",
              },
              {
                point: [4, 17],
                action: "S",
              },
              {
                point: [4, 18],
                action: "S",
              },
              {
                point: [4, 19],
                action: "S",
              },
              {
                point: [4, 20],
                action: "S",
              },
              {
                point: [4, 21],
                action: "S",
              },
              {
                point: [5, 4],
                action: "H",
              },
              {
                point: [5, 5],
                action: "H",
              },
              {
                point: [5, 6],
                action: "H",
              },
              {
                point: [5, 7],
                action: "H",
              },
              {
                point: [5, 8],
                action: "H",
              },
              {
                point: [5, 9],
                action: "D",
              },
              {
                point: [5, 10],
                action: "D",
              },
              {
                point: [5, 11],
                action: "D",
              },
              {
                point: [5, 12],
                action: "S",
              },
              {
                point: [5, 13],
                action: "S",
              },
              {
                point: [5, 14],
                action: "S",
              },
              {
                point: [5, 15],
                action: "S",
              },
              {
                point: [5, 16],
                action: "S",
              },
              {
                point: [5, 17],
                action: "S",
              },
              {
                point: [5, 18],
                action: "S",
              },
              {
                point: [5, 19],
                action: "S",
              },
              {
                point: [5, 20],
                action: "S",
              },
              {
                point: [5, 21],
                action: "S",
              },
              {
                point: [6, 4],
                action: "H",
              },
              {
                point: [6, 5],
                action: "H",
              },
              {
                point: [6, 6],
                action: "H",
              },
              {
                point: [6, 7],
                action: "H",
              },
              {
                point: [6, 8],
                action: "H",
              },
              {
                point: [6, 9],
                action: "D",
              },
              {
                point: [6, 10],
                action: "D",
              },
              {
                point: [6, 11],
                action: "D",
              },
              {
                point: [6, 12],
                action: "S",
              },
              {
                point: [6, 13],
                action: "S",
              },
              {
                point: [6, 14],
                action: "S",
              },
              {
                point: [6, 15],
                action: "S",
              },
              {
                point: [6, 16],
                action: "S",
              },
              {
                point: [6, 17],
                action: "S",
              },
              {
                point: [6, 18],
                action: "S",
              },
              {
                point: [6, 19],
                action: "S",
              },
              {
                point: [6, 20],
                action: "S",
              },
              {
                point: [6, 21],
                action: "S",
              },
              {
                point: [7, 4],
                action: "H",
              },
              {
                point: [7, 5],
                action: "H",
              },
              {
                point: [7, 6],
                action: "H",
              },
              {
                point: [7, 7],
                action: "H",
              },
              {
                point: [7, 8],
                action: "H",
              },
              {
                point: [7, 9],
                action: "H",
              },
              {
                point: [7, 10],
                action: "D",
              },
              {
                point: [7, 11],
                action: "D",
              },
              {
                point: [7, 12],
                action: "H",
              },
              {
                point: [7, 13],
                action: "H",
              },
              {
                point: [7, 14],
                action: "H",
              },
              {
                point: [7, 15],
                action: "H",
              },
              {
                point: [7, 16],
                action: "H",
              },
              {
                point: [7, 17],
                action: "S",
              },
              {
                point: [7, 18],
                action: "S",
              },
              {
                point: [7, 19],
                action: "S",
              },
              {
                point: [7, 20],
                action: "S",
              },
              {
                point: [7, 21],
                action: "S",
              },
              {
                point: [8, 4],
                action: "H",
              },
              {
                point: [8, 5],
                action: "H",
              },
              {
                point: [8, 6],
                action: "H",
              },
              {
                point: [8, 7],
                action: "H",
              },
              {
                point: [8, 8],
                action: "H",
              },
              {
                point: [8, 9],
                action: "H",
              },
              {
                point: [8, 10],
                action: "D",
              },
              {
                point: [8, 11],
                action: "D",
              },
              {
                point: [8, 12],
                action: "H",
              },
              {
                point: [8, 13],
                action: "H",
              },
              {
                point: [8, 14],
                action: "H",
              },
              {
                point: [8, 15],
                action: "H",
              },
              {
                point: [8, 16],
                action: "H",
              },
              {
                point: [8, 17],
                action: "S",
              },
              {
                point: [8, 18],
                action: "S",
              },
              {
                point: [8, 19],
                action: "S",
              },
              {
                point: [8, 20],
                action: "S",
              },
              {
                point: [8, 21],
                action: "S",
              },
              {
                point: [9, 4],
                action: "H",
              },
              {
                point: [9, 5],
                action: "H",
              },
              {
                point: [9, 6],
                action: "H",
              },
              {
                point: [9, 7],
                action: "H",
              },
              {
                point: [9, 8],
                action: "H",
              },
              {
                point: [9, 9],
                action: "H",
              },
              {
                point: [9, 10],
                action: "D",
              },
              {
                point: [9, 11],
                action: "D",
              },
              {
                point: [9, 12],
                action: "H",
              },
              {
                point: [9, 13],
                action: "H",
              },
              {
                point: [9, 14],
                action: "H",
              },
              {
                point: [9, 15],
                action: "H",
              },
              {
                point: [9, 16],
                action: "H",
              },
              {
                point: [9, 17],
                action: "S",
              },
              {
                point: [9, 18],
                action: "S",
              },
              {
                point: [9, 19],
                action: "S",
              },
              {
                point: [9, 20],
                action: "S",
              },
              {
                point: [9, 21],
                action: "S",
              },
              {
                point: [10, 4],
                action: "H",
              },
              {
                point: [10, 5],
                action: "H",
              },
              {
                point: [10, 6],
                action: "H",
              },
              {
                point: [10, 7],
                action: "H",
              },
              {
                point: [10, 8],
                action: "H",
              },
              {
                point: [10, 9],
                action: "H",
              },
              {
                point: [10, 10],
                action: "H",
              },
              {
                point: [10, 11],
                action: "D",
              },
              {
                point: [10, 12],
                action: "H",
              },
              {
                point: [10, 13],
                action: "H",
              },
              {
                point: [10, 14],
                action: "H",
              },
              {
                point: [10, 15],
                action: "H",
              },
              {
                point: [10, 16],
                action: "H",
              },
              {
                point: [10, 17],
                action: "S",
              },
              {
                point: [10, 18],
                action: "S",
              },
              {
                point: [10, 19],
                action: "S",
              },
              {
                point: [10, 20],
                action: "S",
              },
              {
                point: [10, 21],
                action: "S",
              },
              {
                point: [11, 4],
                action: "H",
              },
              {
                point: [11, 5],
                action: "H",
              },
              {
                point: [11, 6],
                action: "H",
              },
              {
                point: [11, 7],
                action: "H",
              },
              {
                point: [11, 8],
                action: "H",
              },
              {
                point: [11, 9],
                action: "H",
              },
              {
                point: [11, 10],
                action: "H",
              },
              {
                point: [11, 11],
                action: "H",
              },
              {
                point: [11, 12],
                action: "H",
              },
              {
                point: [11, 13],
                action: "H",
              },
              {
                point: [11, 14],
                action: "H",
              },
              {
                point: [11, 15],
                action: "H",
              },
              {
                point: [11, 16],
                action: "H",
              },
              {
                point: [11, 17],
                action: "S",
              },
              {
                point: [11, 18],
                action: "S",
              },
              {
                point: [11, 19],
                action: "S",
              },
              {
                point: [11, 20],
                action: "S",
              },
              {
                point: [11, 21],
                action: "S",
              },
        ]
    }
}

// LOCAL STORAGE

const setLocalStorageContent = () => {
    let data = {
        betAmount: betAmount.value,
        currency: currency.value,
        uid: uid.value,
        token: token.value,
        resetSeedBoolean: resetSeedBoolean.value,
    };
    localStorage.setItem('userData', JSON.stringify(data));
    console.log("Saved settings to Local Storage.");
}

const loadLocalStorageContent = () => {
    let data = JSON.parse(localStorage.getItem("userData"));
    if (data) {
        if (data.betAmount) betAmount.value = data.betAmount;
        if (data.currency) currency.value = data.currency;
        if (data.uid) uid.value = data.uid;
        if (data.token) token.value = data.token;
        if (data.resetSeedBoolean) resetSeedBoolean.value = data.resetSeedBoolean;
        console.log("Loaded settings from Local Storage.");
    }
}

onMounted(() => {
    loadLocalStorageContent();
});
</script>