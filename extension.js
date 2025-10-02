import { lib, game, ui, get, ai, _status } from "../../noname.js";
export const type = "extension";
export default function(){
	return {name:"缝合武将",arenaReady:function(){
    
},content:function(config,pack){
    
},prepare:function(){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character: {
        character: {
            "fh_zhaoguang": {
                sex: "male",
                group: "shu",
                hp: 4,
                maxHp: 4,
                hujia: 0,
                skills: ["fh_zhaoguang_yizan","fh_zhaoguang_weita"],
                img: "extension/缝合武将/image/character/fh_zhaoguang.jpg",
                dieAudios: ["ext:缝合武将/audio/die/fh_zhaoguang.mp3"],
            },
            "fh_zhaotong": {
                sex: "male",
                group: "shu",
                hp: 4,
                maxHp: 4,
                hujia: 0,
                skills: ["fh_zhaotong_yizan","fh_zhaotong_longyuan"],
                img: "extension/缝合武将/image/character/fh_zhaotong.jpg",
                dieAudios: ["ext:缝合武将/audio/die/fh_zhaotong.mp3"],
            },
        },
        translate: {
            "缝合武将": "缝合武将",
            "fh_zhaoguang": "赵广",
            "fh_zhaotong": "赵统",
        },
    },
    card: {
        card: {
        },
        translate: {
        },
        list: [],
    },
    skill: {
        skill: {
            "fh_zhaoguang_yizan": {
                audio: "ext:缝合武将/audio/skill:2",
                enable: ["chooseToUse","chooseToRespond"],
                unique: true,
                forceunique: true,
                fixed: true,
                charlotte: true,
                supercharlotte: true,
                persevereSkill: true,
                filter(event, player) {
                    if (event.type === "wuxie" || player.countCards("he") < 1) {
                        return false;
                    }
                    return get
                        .inpileVCardList(info => get.type(info[2]) == "basic")
                        .some(card => {
                            return event.filterCard({ name: card[2], nature: card[3] }, player, event);
                        });
                },
                chooseButton: {
                    dialog(event, player) {
                        const list = get
                            .inpileVCardList(info => get.type(info[2]) == "basic")
                            .filter(card => {
                                return event.filterCard({ name: card[2], nature: card[3] }, player, event);
                            });
                        return ui.create.dialog("翊赞", [list, "vcard"], "hidden");
                    },
                    check(button) {
                        const event = get.event().getParent();
                        if (event.type !== "phase") {
                            return 1;
                        }
                        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
                    },
                    prompt(links) {
                        return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
                    },
                    backup(links, player) {
                        return {
                            selectCard: -1,
                            filterCard: () => false,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                isCard: true,
                                storage: {
                                    fh_zhaoguang_yizan: true,
                                },
                            },
                            precontent() {
                                player.logSkill("fh_zhaoguang_yizan");
                            },
                        };
                    },
                },
                hiddenCard(player, name) {
                    if (player.getStat("skill").fh_zhaoguang_yizan) {
                        return false;
                    }
                    return get.type(name) == "basic" && lib.inpile.includes(name);
                },
                group: ["fh_zhaoguang_yizan_lose"],
                subSkill: {
                    lose: {
                        trigger: {
                            player: ["useCard","respond"],
                        },
                        filter(event, player) {
                            return event.card.storage.fh_zhaoguang_yizan;
                        },
                        direct: true,
                        unique: true,
                        forceunique: true,
                        fixed: true,
                        charlotte: true,
                        supercharlotte: true,
                        persevereSkill: true,
                        content() {
                            "step 0"
                            player.chooseToDiscard(2, true, "he");
                            "step 1"
                            player.draw();
                        },
                        "skill_id": "fh_zhaoguang_yizan_lose",
                        sub: true,
                        sourceSkill: "fh_zhaoguang_yizan",
                        "_priority": 0,
                    },
                },
                "skill_id": "fh_zhaoguang_yizan",
                "_priority": 0,
            },
            "fh_zhaoguang_weita": {
                audio: "ext:缝合武将/audio/skill:2",
                trigger: {
                    global: ["loseAfter","loseAsyncAfter"],
                },
                unique: true,
                forceunique: true,
                fixed: true,
                charlotte: true,
                supercharlotte: true,
                persevereSkill: true,
                filter(event, player) {
                    const canUse = card => {
                        if (player.hasUseTarget(card)) {
                            return true;
                        }
                        return get.info(card).notarget && lib.filter.cardEnabled(card, player);
                    };
                    if (event.type == "discard") {
                        return event.getl?.(player)?.cards2?.some(card => canUse(card));
                    }
                },
                async cost(event, trigger, player) {
                    const cards = [];
                    if (trigger.type == "discard") {
                        cards.addArray(trigger.getl(player).cards2);
                    }
                    const result = await player
                        .chooseButton([get.prompt2(event.skill), cards])
                        .set("filterButton", button => {
                            const player = get.player(),
                                card = button.link;
                            if (player.hasUseTarget(card)) {
                                return true;
                            }
                            return get.info(card).notarget && lib.filter.cardEnabled(card, player);
                        })
                        .forResult();
                    if (result.bool) {
                        event.result = {
                            bool: true,
                            cards: result.links,
                        };
                    }
                },
                async content(event, trigger, player) {
                    const card = event.cards[0];
                    await player.showCards(card, true);
                    await player.chooseUseTarget(card, true, false, "nodistance");
                },
                "skill_id": "fh_zhaoguang_weita",
                "_priority": 0,
            },
            "fh_zhaotong_yizan": {
                audio: "ext:缝合武将/audio/skill:2",
                enable: ["chooseToUse","chooseToRespond"],
                unique: true,
                forceunique: true,
                fixed: true,
                charlotte: true,
                supercharlotte: true,
                persevereSkill: true,
                filter(event, player) {
                    if (event.type === "wuxie" || player.countCards("he") < 1) {
                        return false;
                    }
                    return get
                        .inpileVCardList(info => get.type(info[2]) == "basic")
                        .some(card => {
                            return event.filterCard({ name: card[2], nature: card[3] }, player, event);
                        });
                },
                chooseButton: {
                    dialog(event, player) {
                        const list = get
                            .inpileVCardList(info => get.type(info[2]) == "basic")
                            .filter(card => {
                                return event.filterCard({ name: card[2], nature: card[3] }, player, event);
                            });
                        return ui.create.dialog("翊赞", [list, "vcard"], "hidden");
                    },
                    check(button) {
                        const event = get.event().getParent();
                        if (event.type !== "phase") {
                            return 1;
                        }
                        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
                    },
                    prompt(links) {
                        return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
                    },
                    backup(links, player) {
                        return {
                            selectCard: -1,
                            filterCard: () => false,
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                isCard: true,
                                storage: {
                                    fh_zhaotong_yizan: true,
                                },
                            },
                            precontent() {
                                player.logSkill("fh_zhaotong_yizan");
                            },
                        };
                    },
                },
                hiddenCard(player, name) {
                    if (player.getStat("skill").fh_zhaotong_yizan) {
                        return false;
                    }
                    return get.type(name) == "basic" && lib.inpile.includes(name);
                },
                group: ["fh_zhaotong_yizan_gain"],
                subSkill: {
                    gain: {
                        trigger: {
                            player: ["useCard","respond"],
                        },
                        filter(event, player) {
                            return event.card.storage.fh_zhaotong_yizan && player.countCards("he") > 0;
                        },
                        direct: true,
                        unique: true,
                        forceunique: true,
                        fixed: true,
                        charlotte: true,
                        supercharlotte: true,
                        persevereSkill: true,
                        content(event) {
                            "step 0";
                            if (player.countCards("he") > 1) {
                                player.chooseCard(2, true, "he").set("complexCard", true);
                            } else {
                                player.chooseCard(1, true, "he").set("complexCard", true);
                            }
                            "step 1";
                            if (result.bool) {
                                player.logSkill("fh_zhaotong_yizan_gain");
                                game.log(player, "将", result.cards, "置于武将牌上");
                                player.loseToSpecial(result.cards, "fh_zhaotong_yizan_gain").visible = true;
                            } else {
                                event.finish();
                            }
                            "step 2";
                            player.markSkill("fh_zhaotong_yizan_gain");
                        },
                        intro: {
                            mark(dialog, storage, player) {
                                var cards = player.getCards("s", card => card.hasGaintag("fh_zhaotong_yizan_gain"));
                                if (!cards || !cards.length) {
                                    return;
                                }
                                dialog.addAuto(cards);
                            },
                            markcount(storage, player) {
                                return player.countCards("s", card => card.hasGaintag("fh_zhaotong_yizan_gain"));
                            },
                            onunmark(storage, player) {
                                var cards = player.getCards("s", card => card.hasGaintag("fh_zhaotong_yizan_gain"));
                                if (cards.length) {
                                    player.loseToDiscardpile(cards);
                                }
                            },
                        },
                        "skill_id": "fh_zhaotong_yizan_gain",
                        sub: true,
                        sourceSkill: "fh_zhaotong_yizan",
                        "_priority": 0,
                    },
                },
                "skill_id": "fh_zhaotong_yizan",
                "_priority": 0,
            },
            "fh_zhaotong_longyuan": {
                audio: "ext:缝合武将/audio/skill:2",
                trigger: {
                    target: ["useCardToTargeted"],
                },
                forced: true,
                unique: true,
                forceunique: true,
                fixed: true,
                charlotte: true,
                supercharlotte: true,
                persevereSkill: true,
                filter(event, player) {
                    return get.type(event.card) == "basic";
                },
                content(event) {
                    "step 0"
                    player.chooseToDiscard(2, true, "s", card => card.hasGaintag("fh_zhaotong_yizan_gain"));
                    "step 1"
                    player.draw();
                },
                group: ["fh_zhaotong_longyuan_bro"],
                subSkill: {
                    bro: {
                        trigger: {
                            target: ["useCardToTargeted"],
                        },
                        direct: true,
                        unique: true,
                        forceunique: true,
                        fixed: true,
                        charlotte: true,
                        supercharlotte: true,
                        persevereSkill: true,
                        filter(event, player) {
                            return get.type(event.card) == "basic";
                        },
                        content(event) {
                            "step 0"
                            player.chooseTarget("选择一名其他角色，令其摸一张牌。", function (card, player, target) { return player != target; });
                            "step 1"
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.line(target);
                                target.draw();
                            }
                        },
                        "skill_id": "fh_zhaotong_longyuan_bro",
                        sub: true,
                        sourceSkill: "fh_zhaotong_longyuan",
                        "_priority": -Infinity,
                    },
                },
                "skill_id": "fh_zhaotong_longyuan",
                "_priority": 0,
            },
        },
        translate: {
            "fh_zhaoguang_yizan": "翊赞",
            "fh_zhaoguang_yizan_info": "你需要使用或打出一张基本牌时，若你有牌，你可以视为使用或打出之，然后弃置两张牌（不足则全弃）并摸一张牌。",
            "fh_zhaoguang_weita": "卫沓",
            "fh_zhaoguang_weita_info": "你弃置牌后，你可以展示其中一张牌并使用之（无距离限制）。",
            "fh_zhaotong_yizan": "翊赞",
            "fh_zhaotong_yizan_info": "你需要使用或打出一张基本牌时，若你有牌，你可以视为使用或打出之，然后将两张牌（不足则一张）置于武将牌上（你可以如手牌般使用或打出这些牌）。",
            "fh_zhaotong_longyuan": "龙渊",
            "fh_zhaotong_longyuan_info": "你成为基本牌的目标后，你弃置两张〖翊赞〗置于武将牌上的牌（不足则全弃）并摸一张牌，然后你可以令一名其他角色摸一张牌。",
        },
    },
    intro: "",
    author: "",
    diskURL: "",
    forumURL: "",
    version: "",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
};