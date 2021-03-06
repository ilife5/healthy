$(function() {
    $('[role="diagnose"]').click(function(e) {
        e.preventDefault();

        $("#case").hide();
        $("#healthy").removeClass("v-hide");

        var healthy = new Vue({
            el: '#healthy',
            data: {
                height: "",
                weight: "",
                age: "",
                energyList: [
                    "起床后浑身无力，无精打采，精力严重不足，不能应对日常工作和学习压力",
                    "起床后没有精神，应付日常生活和工作压力能力很弱",
                    "起床后精力比较好，勉强能够应付日常生活和工作压力",
                    "起床后神清气爽，精力充沛，能从容不迫地应付日常生活和工作压力"
                ],
                energy: "",
                mentalityList: [
                    "总是想得很糟糕，或对周围的环境感到不安，逃避应该承担的责任",
                    "处事消极，很不愿意承担责任",
                    "处事有些消极，在各方面要求下，能够承担应有责任",
                    "处事乐观，态度积极，乐于承担责任，不挑剔事物的巨细"
                ],
                mentality: "",
                sleepList: [
                    "严重失眠",
                    "久久不能入睡、睡眠不足的人身体状态较差",
                    "一沾枕头就睡着或睡眠时间不太充足",
                    "睡眠良好的标准是半小时内能自然入眠，青年和中年人睡眠应维持7-8小时睡眠，60岁及大于60岁的人睡眠时间须保证达到6小时"
                ],
                sleep: "",
                adaptabilityList: [
                    "自己身处某种环境之中，看什么都别扭，或者一有变动就觉得焦虑",
                    "身处环境变换时有较重焦虑、心理不适",
                    "环境变化时有轻微焦虑，但能缓慢适应环境",
                    "应变能力强，即使有轻微焦虑，但能很快能适应环境"
                ],
                adaptability: "",
                resistanceList: [
                    "一年内经常感冒，抵抗力明显很差，必须服用药物",
                    "一年内感冒次数较多，必须用药物治疗",
                    "一年内感冒次数较少，并有时需要吃药",
                    "一年内不感冒或患上几次感冒，并且感冒有时不吃药就能好"
                ],
                resistance: "",
                visionList: [
                    "常使用滴眼液来缓解眼疲劳，眼睑经常发炎，视力低下严重",
                    "视力在3.0以上，眼睑有时发炎，常使用滴眼液来缓解眼疲劳",
                    "视力在3.9以上，眼睑不发炎，不常使用滴眼液",
                    "视力在4.5以上，眼睛明亮，反应敏锐，眼睑不发炎"
                ],
                vision: "",
                toothList: [
                    "牙表面出现裂痕，缺乏光泽。有牙龈炎、牙周炎等",
                    "有蛀牙，牙齿疼痛，有明显牙渍；牙龈红肿，刷牙出血",
                    "牙齿偏黄，无龋齿，有的牙齿疼痛；牙龈颜色稍不正常，有时刷牙出血",
                    "牙齿清洁，无空洞，无龋齿，无痛感；齿龈颜色正常，很少出血"
                ],
                tooth: "",
                hairList: [
                    "头发干枯，头屑很多，头皮很痒",
                    "头发无光泽，头屑洗不干净，头皮经常发痒",
                    "头发有光泽，有些许头屑，洗头之前比较痒",
                    "头发有光泽，时刻无头屑"
                ],
                hair: "",
                skinList: [
                    "肌肉、皮肤没有弹性，很松弛，走路总感到很沉重，没有力量。并且可能患上骨关节疾病",
                    "肌肉、皮肤弹性较差，走路比较吃力，肌肉没有力量",
                    "肌肉、皮肤比较有弹性，走路不太轻松",
                    "肌肉、皮肤富有弹性，走路轻松有力"
                ],
                skin: ""
            },
            methods: {
                score: function() {
                    var model = getModel();
                    if(model) {
                        var $result = $("#result");
                        var score = getScore(model);

                        $("#healthy").hide();
                        $result.show();

                        new Vue({
                            el: $result.get(0),
                            data: $.extend({
                                score: score,
                                desc: getEvaluate(score)
                            }, adviser[getGroup(model.age)])
                        });
                        window.scrollTo(0,0);
                        drayRadar(model);
                    }
                }
            }
        });

        function getScore(data) {
            var keys = ["energy", "mentality", "sleep",
                "adaptability", "resistance", "bmi", "vision", "tooth", "hair", "skin"];
            var at = At[getGroup(data.age)];
            var r = 0;

            keys.forEach(function(key, index) {
                r += at[index] * data[key];
            });

            return r / 100;
        }

        function getModel() {
            var data = JSON.parse(JSON.stringify(healthy.$data));
            var keys = ["energy", "mentality", "sleep",
                "adaptability", "resistance", "vision", "tooth", "hair", "skin"];
            var model = {};

            if(validate(data)) {
                keys.forEach(function(key) {
                    model[key] = [25, 50, 75, 100][data[key]];
                });
            } else {
                alert("有未填写的项");

                return;
            }

            model.bmi = BMI(data.weight, data.height);
            model.age = data.age;

            return model;
        }

        function validate(data) {
            var keys = ["height", "weight", "age", "energy", "mentality", "sleep",
                "adaptability", "resistance", "vision", "tooth", "hair", "skin"];

            for(var i = 0; i < keys.length; i++) {
                if((data[keys[i]] + "").trim() === "") {
                    return false;
                }
            }

            return true;
        }

        function drayRadar(model) {

            var keys = ["energy", "mentality", "sleep",
                "adaptability", "resistance", "bmi", "vision", "tooth", "hair", "skin"];

            var values = keys.map(function(key) {
                return model[key];
            });

            var option = {
                radius: 120,
                startAngle: 90,
                radar: [
                    {
                        indicator: [
                            { text: '精力', max: 100 },
                            { text: '应变能力', max: 100 },
                            { text: '睡眠', max: 100 },
                            { text: '心态', max: 100 },
                            { text: '抵抗力', max: 100 },
                            { text: '身材', max: 100 },
                            { text: '视力', max: 100 },
                            { text: '牙齿', max: 100 },
                            { text: '头发', max: 100 },
                            { text: '肌肉和皮肤', max: 100 }
                        ]
                    }
                ],series: [
                    {
                        name: '健康雷达',
                        type: 'radar',
                        data: [
                            {
                                value: values,
                                name: '健康',
                                symbol: 'rect',
                                symbolSize: 5,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return {
                                                25: "差",
                                                50: "较差",
                                                75: "良好",
                                                100: "健康"
                                            }[params.value];
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            };

            var myChart = echarts.init(document.getElementById('chart'));

            myChart.setOption(option);
        }
    });

});

var At = {
    young: [8.7, 8.7, 5.7, 10.7, 7.7, 10.7, 12.7, 12.7, 14.7, 7.7],
    middle: [10, 6, 6, 15, 6, 11, 12, 11, 15, 8],
    elderly: [12.2, 9.2, 7.2, 11.2, 9.2, 8.2, 12.2, 7.2, 11.2, 12.2],
    old: [13, 9, 9, 11, 10, 7, 11, 6, 12, 12],
    longevity: [15, 8, 12, 8, 11, 7, 9, 8, 7, 15]
};

var adviser = {
    young: {
        mental: [
            "保持乐观的情绪，要善于排除不良情绪。",
            "要积极帮助别人。赠人玫瑰，手留余香，使自己时刻保持良好心态。",
            "善待别人，心胸大度。以谅解、宽容、信任、友爱等积极态度与人相处，会得到快乐的情绪体验。",
            "要培养广泛的爱好。比如收藏、体育、旅游、音乐等，全身心地投入其中，享受其间的乐趣，既能增长知识、广泛交友，又能陶冶情操。",
            "培养生活中的幽默感。除了严肃、正式的场合外，在同事、朋友乃至家人中，说话时适当地采用幽默语言，对活跃气氛、融洽关系都非常有益，在一阵会心的笑声中，大家心情特别好。",
            "保持一颗童心，对任何事物都有一种好奇，不论对知识更新，有助于身心健康。",
            "学会谐调自己与社会的关系。我们要经常调整自己的意识和行为，适应社会的规范，并不断学习，提高自己的适应力，从而减少因此而带来的困惑和压力，保持心理健康。"
        ],
        rest: [
            "晚上10点左右睡觉，早晨6点左右起床。保证7~8小时的睡眠时间。",
            "早晚刷牙，（吃完东西后也可以刷牙），并且每只牙刷最多用三个月。",
            "不间断面对电脑至多3小时，然后洗脸，休息至少15分钟，做眼保健操或远望。这有助于保护视力和皮肤。"
        ],
        exercise: [
            "每天晚饭过后，出去锻炼至少1小时（锻炼强度要不亚于慢跑1小时）。"
        ],
        diet: [
            "早餐要吃好，可以吃稀饭、豆浆，也可以吃面包、牛奶，最好吃一颗鸡蛋。",
            "午餐要吃饱，以米饭或面类为主，菜要荤素搭配。",
            "晚餐要吃少，以米饭或面类为主，菜荤素搭配，最好以蔬菜为主。",
            "加餐：时令水果"
        ],
        remarks: ["为扩展知识面，每天至少花30分钟看书、报纸或新闻。同时让心胸更加关阔，看待事情会更加合理，有利于身心健康。"]
    },
    middle: {
        mental: ["保持乐观的情绪，要善于排除不良情绪。",
            "要积极帮助别人。赠人玫瑰，手留余香，使自己时刻保持良好心态。",
            "善待别人，心胸大度。以谅解、宽容、信任、友爱等积极态度与人相处，会得到快乐的情绪体验。",
            "要培养广泛的爱好。比如收藏、体育、旅游、音乐等，全身心地投入其中，享受其间的乐趣，既能增长知识、广泛交友，又能陶冶情操。",
            "培养生活中的幽默感。除了严肃、正式的场合外，在同事、朋友乃至家人中，说话时适当地采用幽默语言，对活跃气氛、融洽关系都非常有益，在一阵会心的笑声中，大家心情特别好。"
        ],
        rest: [
            "晚上10点左右睡觉，早晨6点左右起床。保证7~8小时的睡眠时间。",
            "早晚刷牙，（吃完东西后也可以刷牙），并且每只牙刷最多用三个月。",
            "不间断面对电脑至多3小时，然后洗脸，休息至少15分钟，做眼保健操或远望。这有助于保护视力和皮肤。"
        ],
        exercise: [
            "每天晚饭过后，出去锻炼至少1小时（锻炼强度要不亚于慢跑1小时）。"
        ],
        diet: [
            "早餐要吃好，可以吃稀饭、豆浆，也可以吃面包、牛奶，最好吃一颗鸡蛋。",
            "午餐要吃饱，以米饭或面类为主，菜要荤素搭配。",
            "晚餐要吃少，以米饭或面类为主，菜荤素搭配，最好以蔬菜为主。",
            "加餐：时令水果"
        ],
        remarks: ["为扩展知识面，每天至少花30分钟看书、报纸或新闻。同时让心胸更加关阔，看待事情会更加合理，有利于身心健康。"]
    },
    elderly: {
        mental: ["保持乐观的情绪，要善于排除不良情绪。",
            "要积极帮助别人。赠人玫瑰，手留余香，使自己时刻保持良好心态。",
            "善待别人，心胸大度。以谅解、宽容、信任、友爱等积极态度与人相处，会得到快乐的情绪体验。",
            "要培养广泛的爱好。比如收藏、体育、旅游、音乐等，全身心地投入其中，享受其间的乐趣，既能增长知识、广泛交友，又能陶冶情操。",
            "培养生活中的幽默感。除了严肃、正式的场合外，在同事、朋友乃至家人中，说话时适当地采用幽默语言，对活跃气氛、融洽关系都非常有益，在一阵会心的笑声中，大家心情特别好。"
        ],
        rest: [
            "晚上10点左右睡觉，早晨6点左右起床。保证7~8小时的睡眠时间。",
            "早晚刷牙，（吃完东西后也可以刷牙），并且每只牙刷最多用三个月。",
            "不间断面对电脑至多3小时，然后洗脸，休息至少15分钟，做眼保健操或远望。这有助于保护视力和皮肤。"
        ],
        exercise: [
            "每天晚饭过后，出去锻炼至少1小时（锻炼强度要不亚于慢跑1小时）。"
        ],
        diet: [
            "早餐要吃好，可以吃稀饭、豆浆，也可以吃面包、牛奶，最好吃一颗鸡蛋。",
            "午餐要吃饱，以米饭或面类为主，菜要荤素搭配。",
            "晚餐要吃少，以米饭或面类为主，菜荤素搭配，最好以蔬菜为主。",
            "加餐：时令水果"
        ],
        remarks: ["为扩展知识面，每天至少花30分钟看书、报纸或新闻。同时让心胸更加关阔，看待事情会更加合理，有利于身心健康。", "食物要以养生食物为主。例如豆腐、竹笋、海藻、酸奶、薯类等。"]
    },
    old: {
        mental: ["保持乐观的情绪，要善于排除不良情绪。",
            "要积极帮助别人。赠人玫瑰，手留余香，使自己时刻保持良好心态。",
            "善待别人，心胸大度。以谅解、宽容、信任、友爱等积极态度与人相处，会得到快乐的情绪体验。",
            "要培养广泛的爱好。比如收藏、体育、旅游、音乐等，全身心地投入其中，享受其间的乐趣，既能增长知识、广泛交友，又能陶冶情操。",
            "培养生活中的幽默感。除了严肃、正式的场合外，在同事、朋友乃至家人中，说话时适当地采用幽默语言，对活跃气氛、融洽关系都非常有益，在一阵会心的笑声中，大家心情特别好。"
        ],
        rest: [
            "晚上10点左右睡觉，早晨6点左右起床。保证7~8小时的睡眠时间。",
            "早晚刷牙，（吃完东西后也可以刷牙），并且每只牙刷最多用三个月。",
            "不间断面对电脑至多3小时，然后洗脸，休息至少15分钟，做眼保健操或远望。这有助于保护视力和皮肤。"
        ],
        exercise: [
            "每天晚饭过后，出去锻炼至少1小时（锻炼强度要不亚于慢跑1小时）。"
        ],
        diet: [
            "早餐要吃好，可以吃稀饭、豆浆，也可以吃面包、牛奶，最好吃一颗鸡蛋。",
            "午餐要吃饱，以米饭或面类为主，菜要荤素搭配。",
            "晚餐要吃少，以米饭或面类为主，菜荤素搭配，最好以蔬菜为主。",
            "加餐：时令水果"
        ],
        remarks: ["为扩展知识面，每天至少花30分钟看书、报纸或新闻。同时让心胸更加关阔，看待事情会更加合理，有利于身心健康。", "每餐尽量吃，食物要以养生食物为主。例如豆腐、竹笋、海藻、酸奶、薯类等"]
    },
    longevity: {
        mental: ["保持乐观的情绪，要善于排除不良情绪。",
            "要积极帮助别人。赠人玫瑰，手留余香，使自己时刻保持良好心态。",
            "善待别人，心胸大度。以谅解、宽容、信任、友爱等积极态度与人相处，会得到快乐的情绪体验。",
            "要培养广泛的爱好。比如收藏、体育、旅游、音乐等，全身心地投入其中，享受其间的乐趣，既能增长知识、广泛交友，又能陶冶情操。",
            "培养生活中的幽默感。除了严肃、正式的场合外，在同事、朋友乃至家人中，说话时适当地采用幽默语言，对活跃气氛、融洽关系都非常有益，在一阵会心的笑声中，大家心情特别好。"
        ],
        rest: [
            "晚上10点左右睡觉，早晨6点左右起床。保证7~8小时的睡眠时间。",
            "早晚刷牙，（吃完东西后也可以刷牙），并且每只牙刷最多用三个月。",
            "不间断面对电脑至多3小时，然后洗脸，休息至少15分钟，做眼保健操或远望。这有助于保护视力和皮肤。"
        ],
        exercise: [
            "每天晚饭过后，出去锻炼至少1小时（锻炼强度要不亚于慢跑1小时）。"
        ],
        diet: [
            "早餐要吃好，可以吃稀饭、豆浆，也可以吃面包、牛奶，最好吃一颗鸡蛋。",
            "午餐要吃饱，以米饭或面类为主，菜要荤素搭配。",
            "晚餐要吃少，以米饭或面类为主，菜荤素搭配，最好以蔬菜为主。",
            "加餐：时令水果"
        ],
        remarks: ["为扩展知识面，每天至少花30分钟看书、报纸或新闻。同时让心胸更加关阔，看待事情会更加合理，有利于身心健康。", "每餐尽量吃，食物要以养生食物为主。例如豆腐、竹笋、海藻、酸奶、薯类等", "外出时一定要注意安全"]
    }
};

function BMI(w, h) {
    var bmi = (w / Math.pow(h/100, 2));

    if(bmi >= 33) {
        return 25;
    } else if(bmi >= 29) {
        return 50;
    } else if(bmi >= 25) {
        return 75;
    } else {
        return 100;
    }
}

function getGroup(age) {
    if(age <= 44) {
        return "young";
    } else if(age <= 59) {
        return "middle";
    } else if(age <= 74) {
        return "elderly";
    } else if(age <= 89) {
        return "old";
    } else {
        return "longevity";
    }
}

function getEvaluate(score) {
    if(score >= 81) {
        return "优秀";
    } else if(score >= 61) {
        return "良好";
    } else if(score >= 41) {
        return "较差";
    } else {
        return "很差";
    }
}

