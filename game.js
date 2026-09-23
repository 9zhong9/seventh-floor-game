const SAVE_KEY = 'seventh-floor-save-v1';
const initial = { scene:'intro', hp:5, sanity:5, clues:0, blood:0, spared:0 };
let state = {...initial};

const scenes = {
  intro:{ floor:'序章 · 不存在的楼层', title:'欢迎回家', character:'广播中的男声 · 年龄不明', text:'你在冰冷的电梯里醒来。\n\n广播用温和的声音宣布：\n“完成每一层的清扫，电梯才会继续上行。”\n\n门外传来指甲刮过墙面的声音。你的口袋里有一把折叠刀，以及一张写着自己名字的住户卡。', choices:[
    ['按下 1 楼','floor1',{},'电梯缓慢下降。'],
    ['检查住户卡','card', {clues:1},'卡片背面写着：不要相信穿白色衣服的人。']
  ]},
  card:{ floor:'序章 · 住户卡', title:'第三次登记', character:'你的名字 · 已登记三次', text:'卡片背面有三道刻痕。\n\n第一道：第一次，你没有逃出去。\n第二道：第二次，你带了一个人上楼。\n第三道：没有文字，只有一滴发黑的血。\n\n电梯门打开，一楼大厅里有人站在接待台后。', choices:[['走出电梯','floor1',{},'你收好卡片，走进大厅。']] },
  floor1:{ floor:'一楼 · 接待大厅', title:'沈砚的登记簿', character:'沈砚，28 岁 · 前台管理员', text:'男人穿着剪裁合身的黑色西装，指尖压在一本厚重的登记簿上。\n\n“只要签字，你就能上楼。”他微笑道，“前提是证明自己不是这栋楼里的‘人’。”', choices:[
    ['查看登记簿','book',{clues:1,sanity:-1},'登记簿中的名字正在变化。'],
    ['相信沈砚，签字','signed',{blood:1},'笔尖划破了你的指腹。'],
    ['拒绝签字，寻找出口','escape',{hp:-1},'大厅的门锁同时落下。']
  ]},
  book:{ floor:'一楼 · 接待大厅', title:'登记簿里的你', character:'沈砚，28 岁 · 笑容消失了', text:'每一页都是同一个名字——你的名字。记录后面写着“死亡”“上行”，还有一行：\n\n“沈砚：非住户。负责清除第一个发现真相的人。”\n\n他的影子比身体慢了一拍。', choices:[
    ['指出他不是人类','floor2',{clues:1},'沈砚的影子向相反的方向移动。'],
    ['趁他分神冲向电梯','floor2',{hp:-1},'你撞开消防门，进入上行通道。']
  ]},
  signed:{ floor:'一楼 · 红色通行证', title:'住户成立', character:'沈砚，28 岁 · 一楼清扫员', text:'血液渗入纸张。登记簿合上的瞬间，沈砚的脖颈发出细微的扭动声。\n\n“签过字，就算住户了。”\n\n他的袖口下传来骨骼摩擦的声音，通往电梯的红灯亮起。', choices:[['攻击沈砚，进入电梯','floor2',{hp:-1,blood:2},'大厅里只剩下断续的广播声。'],['后退，寻找消防通道','floor2',{sanity:-1},'你没有确认沈砚是否真正倒下。']] },
  escape:{ floor:'一楼 · 错误的门', title:'门后不是街道', character:'沈砚，28 岁 · 站在你身后', text:'侧门后是一条堆满湿脚印的狭窄走廊。\n\n“出口从来不在这一层。”沈砚的声音贴着你的耳边。\n\n玻璃碎裂，你没有回头，朝着楼梯一路冲上去。', choices:[['继续向二楼','floor2',{},'你暂时甩开了身后的脚步声。']] },
  floor2:{ floor:'二楼 · 住户区', title:'林澈的守则', character:'林澈，24 岁 · 二楼住户', text:'走廊两侧的房门全部敞开，门上贴着相同的纸条：\n\n第一条：不要回应走廊尽头的人。\n第二条：不要进入没有灯光的房间。\n第三条：如果看见林澈，请立刻闭上眼睛。\n\n走廊尽头，一个穿浅色衬衫的男人背对着你。', choices:[
    ['闭上眼睛','blind',{sanity:-1},'闭眼后，走廊里多出了一个呼吸声。'],
    ['叫出他的名字','name',{clues:1},'林澈的声音从不同房间同时传来。'],
    ['进入无灯房间','dark',{hp:-1,blood:1},'黑暗里有东西擦过你的肩膀。']
  ]},
  blind:{ floor:'二楼 · 住户区', title:'第四条守则', character:'林澈，24 岁 · 声音就在面前', text:'你闭上眼睛。林澈没有靠近，可呼吸声越来越清晰。\n\n“很好，你遵守了第三条。”\n\n“但不要相信任何已经闭上眼睛的人。”\n\n你睁眼时，林澈站在面前，眼睛仍然紧闭。', choices:[['后退并寻找电梯','floor3',{clues:1},'林澈没有阻拦，只是对着你笑。'],['询问他真正的身份','truth',{sanity:-1,clues:1},'林澈说出了一个不属于你的记忆。']] },
  name:{ floor:'二楼 · 名字的回声', title:'林澈不存在', character:'林澈，24 岁 · 二楼异常体', text:'你叫出了他的名字。所有房门同时合上。\n\n“这里没有林澈。”他温和地说，“林澈在三天前就死了。现在站着的，只是他留下来的习惯。”', choices:[['要求他让路','floor3',{blood:1},'林澈侧身让开，脚下留下一串湿脚印。'],['问他谁杀了他','truth',{clues:2},'林澈指向了楼梯上方。']] },
  dark:{ floor:'二楼 · 无灯房间', title:'房间里没有人', character:'林澈，24 岁 · 门外', text:'墙壁上挂满林澈的照片，每一张都比上一张憔悴。最后一张照片里，他站在你的身后。\n\n门外传来声音：“这里没有人。所以，里面的东西不算人。”', choices:[['砸碎墙上的照片','floor3',{hp:-1,clues:1,blood:1},'照片背后的墙体是温热的。'],['保持安静直到门打开','floor3',{sanity:-1},'门开时，林澈已经不在走廊里。']] },
  truth:{ floor:'二楼 · 住户区', title:'他记得你的死法', character:'林澈，24 岁 · 被困住的住户', text:'林澈说，自己每次都会在二楼醒来，每次都会遇见试图上楼的人。\n\n“你已经来过这里很多次。只是这一次，你更像一个活人。”\n\n电梯门上，多出了一道细长的血手印。', choices:[['放过林澈，独自上楼','floor3',{spared:1,sanity:1},'林澈第一次露出了真正的表情：疲惫。'],['按照广播要求清扫二楼','floor3',{blood:2,clues:1},'走廊恢复寂静，但寂静并不代表安全。']] },
  floor3:{ floor:'三楼 · 白色诊疗区', title:'顾凛的诊断', character:'顾凛，31 岁 · 三楼主治医师', text:'三楼铺满白色瓷砖，干净得反常。走廊尽头站着一个穿白大褂的男人，手里拿着一份病历。\n\n“患者已经进入第三阶段。”顾凛说，“你要继续扮演受害者，还是承认自己是这栋楼的病灶？”', choices:[['抢走病历','endingTruth',{hp:-1,clues:2},'病历第一页的日期是明天。'],['质问他为什么认识你','endingLoop',{sanity:-1,clues:1},'顾凛说：因为每一次都是我送你进来的。'],['直接攻击顾凛','endingBlood',{hp:-2,blood:3},'白色诊疗区第一次出现了红色。']] },
  endingTruth:{ floor:'终局 · 诊疗区', title:'真相结局：病灶', character:'顾凛，31 岁 · 最后一名看护者', text:'病历中没有你的出生记录，只有一行重复了无数次：\n\n“该对象无法离开，因为该对象就是建筑本身。”\n\n你终于想起：不是有人把你困在大楼里，是你为了逃避某件事，把自己关进了这里。', choices:[['承认自己就是大楼','endingAccept',{clues:1},'所有楼层的灯同时熄灭。'],['否认一切，进入电梯','endingLoop',{},'电梯再次显示：0。']] },
  endingBlood:{ floor:'终局 · 诊疗区', title:'血色结局：清扫完成', character:'顾凛，31 岁 · 最后一名目标', text:'你没有再听广播，也没有再问问题。白色地面被染成暗红色。\n\n三楼所有的门同时打开，门后站着你曾经遇到的每一个人。他们没有攻击你，只是在等待新的管理员出现。', choices:[['按下“接待”','endingAdmin',{},'你听见自己的声音：欢迎回家。']] },
  endingLoop:{ floor:'终局 · 循环', title:'循环结局：再次醒来', character:'三个不同的声音', text:'电梯门打开，门外是熟悉的接待大厅。广播再次响起：\n\n“请完成每一层的清扫。只有确认该层没有活人，电梯才会继续上行。”\n\n你低头看见自己的手里握着一把折叠刀。', choices:[['重新开始','restart',{},'循环重新开始。']] },
  endingAccept:{ floor:'终局 · 建筑核心', title:'隐藏结局：第七码楼', character:'你 · 大楼的意识', text:'你承认了。墙壁开始呼吸，电梯、房间和每一个人都变成记忆碎片。\n\n真正需要被清除的，不是住户，而是那个拒绝承认真相的自己。大楼安静下来，天亮了。', choices:[['从头体验','restart',{},'新的记录开始了。']] },
  endingAdmin:{ floor:'终局 · 接待大厅', title:'管理员结局', character:'新任管理员 · 你的年龄不详', text:'你回到一楼。沈砚的位置空了出来。登记簿最后一页写着：\n\n“下一位访客即将抵达。”\n\n门外响起敲门声。你整理好衣领，露出一个恰到好处的微笑。', choices:[['重新开始','restart',{},'你成为了新的接待员。']] },
  restart:{ floor:'系统', title:'重新开始', character:'', text:'所有记录已清除。你再次在不存在的楼层醒来。', choices:[['开始游戏','intro',{},'新的记录开始了。']] }
};

function apply(effect={}) { Object.keys(effect).forEach(k => { if (typeof state[k] === 'number') state[k] += effect[k]; }); state.hp=Math.max(0,Math.min(5,state.hp)); state.sanity=Math.max(0,Math.min(5,state.sanity)); }
function render(id=state.scene) {
  state.scene=id; const s=scenes[id];
  document.querySelector('#floor').textContent=s.floor; document.querySelector('#title').textContent=s.title; document.querySelector('#character').textContent=s.character; document.querySelector('#story').textContent=s.text;
  document.querySelector('#hp').textContent=state.hp; document.querySelector('#sanity').textContent=state.sanity; document.querySelector('#clues').textContent=state.clues; document.querySelector('#blood').textContent=state.blood;
  const box=document.querySelector('#choices'); box.innerHTML='';
  if (state.hp<=0 || state.sanity<=0) { showFailure(box); return; }
  s.choices.forEach(([label,next,effect,notice],i) => { const b=document.createElement('button'); b.textContent=`${i+1}. ${label}`; b.onclick=()=>{ apply(effect); document.querySelector('#notice').textContent=notice||'你做出了选择。'; state.scene=next==='restart'?'intro':next; save(true); render(state.scene); }; box.appendChild(b); });
}
function showFailure(box) { document.querySelector('#title').textContent=state.hp<=0?'死亡结局':'精神崩溃'; document.querySelector('#story').textContent=state.hp<=0?'你倒在了冰冷的楼梯上。广播没有停止，只是换了一个更温柔的声音。':'你已经无法分辨楼层、住户和自己的记忆。当电梯门再次打开时，你主动走了进去。'; const b=document.createElement('button'); b.textContent='重新开始'; b.onclick=()=>{state={...initial};render();}; box.appendChild(b); }
function save(silent=false) { localStorage.setItem(SAVE_KEY,JSON.stringify(state)); if(!silent) document.querySelector('#notice').textContent='进度已保存。'; }
document.querySelector('#save').onclick=()=>save();
document.querySelector('#load').onclick=()=>{const x=localStorage.getItem(SAVE_KEY); if(x){state=JSON.parse(x);render();document.querySelector('#notice').textContent='已读取存档。';}else document.querySelector('#notice').textContent='没有找到存档。';};
document.querySelector('#restart').onclick=()=>{if(confirm('确定删除当前进度并重新开始吗？')){localStorage.removeItem(SAVE_KEY);state={...initial};render();}};
render();
