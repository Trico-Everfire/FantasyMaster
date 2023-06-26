const { readdirSync } = require("fs");
const { ItemRegistry, NPCRegistry } = require("./registers");

class Timer {

    /**
     * 
     * @param {()=>NPCRegistry} npcRegistrylambda 
     * @param {()=>ItemRegistry} itemRegistrylambda 
     */
    constructor(npcRegistrylambda, itemRegistrylambda ){
        this.npcRegistrylambda = npcRegistrylambda;
        this.itemRegistrylambda = itemRegistrylambda;
    }

    tick(manual) {
        let time = new Date();
        if ((time.getMinutes() == "00" && time.getHours() % 2 == 0) || manual == "stockManually") {
    
            const npcRegistry = this.npcRegistrylambda().NPCRegistry.getRegistry();
            const itemRegistry = this.itemRegistrylambda();

            for (let NPCV in npcRegistry) {
                const NPCI = npcRegistry[NPCV];
                const NPC = NPCI.getData();
                let coreWares = [];
                NPC.made = 0;
                NPC.wares = [];
                for (let i = 0; i < Math.floor(Math.random() * itemRegistry.shopItems.length) + 4; i++) {
                    let getItem = itemRegistry.shopItems[Math.floor(Math.random() * (itemRegistry.shopItems.length - 1))];
                    if (!coreWares.includes(getItem)) {
                        coreWares.push(getItem);
                        let bool = Math.round(Math.random() * 1) == 1;
                        let nbv =
                            getItem.BaseValue +
                            (bool
                                ? Number.parseInt(getItem.BaseValue / 24)
                                : -Number.parseInt(getItem.BaseValue / 24));
                        // console.log(getItem.Name,bool,nbv)
                        getItem.BaseValue = nbv;
                        getItem.Quantity = Math.floor(Math.random() * 5) + 1;
                        NPC.has = Math.floor(Math.random() * 3500) + 1500;
                        NPC.wares.push(getItem);
                    }
                }
                
                NPCI.saveData();
            }
            console.log("socked!", time.getHours());
        }
        //sunday 1
        //monday 2
        //thuesday 3
        //wednesday 4
        //thurseday 5
        //friday 6
        //saturday 7
    
        //redo this once the mazes have been revamped and reimplemented.
        // if(((time.getDate() == "1" && time.getHours() == "0" && time.getMinutes() == "00")) || manual == "genMazeLoot"){
        // 	console.time("fill:D")
        // 	let mazes = DataBase.viewItemsSync("dungeons",0).val;
        // 	for(let i = 0; i < mazes.length; i++){
        // 		let minstance = new MazeInstnace("RGM" + i);
        //         let mazeInstance = new Maze();
        // 		mazeInstance.insertExistingMaze(minstance.getMazeData())
        // 		mazeInstance.drawInfo.specialLootTable = {}//empting the original;
        // 		for(let center of mazeInstance.drawInfo.isCenter){
        // 			mazeInstance.drawInfo.specialLootTable[center.toString()] = []
        // 			let coreWares = [];
        // 			for (let i = 0; i < Math.floor(Math.random() * 6) + 3; i++) {
        // 				let getItem = itemRegistry.getRegistry().get(Math.floor(Math.random() * (itemRegistry.getRegistry().length - 1)) + 0);
        // 				if (!coreWares.includes(getItem)) {
        // 					coreWares.push(getItem);
        // 					let bool = Math.round(Math.random() * 1) == 1;
        // 					let nbv = getItem.BaseValue + (bool ? Number.parseInt(getItem.BaseValue / 24) : -Number.parseInt(getItem.BaseValue / 24));
        // 					getItem.BaseValue = nbv;
        // 					getItem.Quantity = Math.floor(Math.random() * 5) + 1;
        // 					mazeInstance.drawInfo.specialLootTable[center.toString()].push(getItem)
        // 				}
        // 			}
        // 		}
        // 		minstance.setMazeData(mazeInstance)
        // 		//console.table(mazeInstance);
        // 	}
        // 	console.timeEnd("fill:D")
        // 	console.log("filled MazeRoom!", time.getMonth()+1)
        // }
        // let momenta = moment()
        // let midnight = momenta.clone().startOf("day");
        // let difference = momenta.diff(midnight,"seconds")
        // console.log(getFitsIn(difference,60))
    //	let SOD = (difference)
    
        // if (time.getMinutes() == "00") {
        // 	TOD = time.getHours() % 2 == 0 ? "day" : "night";
        // }
    
        // if (time.getMinutes() == "00") HOD = 0;
        // else HOD = (12 / 60) * time.getMinutes();
    }
    
    ActivateTickInterval(){
        setInterval(()=>this.tick(), 60000);
    
    }
}



exports.Timer = Timer;