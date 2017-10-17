// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
window.boxA = boxA, window.boxB = boxB;
// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
window.Engine = Engine;
window.Bodies = Bodies;
window.World = World;
window.Render = Render;
window.engine = engine;
window.render = render;
var screen = document.querySelector("canvas");
window.screen = screen;
function keyListener(event){
  console.log(event);
  boxA.position.x++
}
function defaultSeed(){
  let ent = [];
  let initVals=[];
  let afterVals=[];
  for(let i = 0; i < this.userData.args.length; i++){
    if(i < 1){
      let xVal = Math.min(Math.max(Math.random()*this.userData.screen.width,0),this.userData.screen.width);
      initVals.push(xVal);
      ent.push(xVal);
    }else if(i < 2){
      let yVal = Math.min(Math.max(Math.random()*this.userData.screen.height,0),this.userData.screen.height);
      initVals.push(yVal);
      ent.push(yVal);
    }else if(i < 4){
      let dim = Math.floor((Math.random()+1)*50);
      initVals.push(dim);
      ent.push(dim);
    }else{
      let v = ((Math.random()-0.5)*2)*5;
      afterVals.push(v);
      ent.push(v);
    }
  }
  return ent;
}
function defaultFitness(ent){
  let dist = 0.0000001 + Math.sqrt(Math.pow(this.userData.target.x - ent[0],2)+Math.pow(this.userData.target.y - ent[1],2));
  let fit = 1 / dist;
  return fit;
}
function defaultMutate(ent){
  let drift = ((Math.random()-0.5)*2)*5;
  let index = Math.floor(Math.random()*ent.length);
  ent[index] += drift;
  return ent;
}
function defaultGeneration(pop, generation, stats){
  //console.log(pop, generation, stats)
}

function defaultNotification(pop, gen, stats, isFinished){
  console.log(...arguments)
  if(!isFinished){
    World.clear(engine.world, true);
  }else{
    for(let ind in pop){
      let ent = pop[ind].entity;
      let initVals = [ent[0],ent[1],ent[2],ent[3]];
      let afterVals = [ent[4],ent[5]];
      let box_ = Bodies.rectangle(...initVals);
      box_.collisionFilter.group = -1;
      World.add(engine.world, box_);
      Matter.Body.setVelocity(box_, {x: afterVals[0],y: afterVals[1]});
    }
  }
}
//Will add later
function defaultCrossover(m,f){


}
const geneticDefault = {
  "seed": defaultSeed,
  "mutate": defaultMutate,
//  "crossover": defaultCrossover,
  "fitness": defaultFitness,
  "generation": defaultGeneration,
  "notification": defaultNotification,
  "optimize": Genetic.Optimize.Maximize,
  "select1": Genetic.Select1.Tournament3,
  "select2": Genetic.Select2.Tournament3,
  "userData":{
    "args":[
      "x",
      "y",
      "w",
      "h",
      "vx",
      "vy",
    ],
    "target":{
      "x":700,
      "y":500
    },
    "screen":{
      "width":screen.width,
      "height":screen.height
    },
  },
};
window.geneticDefault = geneticDefault;
function compileGenetics(input, options){
  let output = Genetic.Clone(input);
  output.evolve = input.evolve;
  for(let option in geneticDefault){
    if(options){
      if(options[option]){
        output[option] = options[option];
      }else{
        output[option] = geneticDefault[option];
      }
    }else{
      output[option] = geneticDefault[option];
    }
  }
  return output;
}
function createGenetics(options){
    let output = Genetic.create();
    for(let option in geneticDefault){
      if(options){
        if(options[option]){
          output[option] = options[option];
        }else{
          output[option] = geneticDefault[option];
        }
      }else{
        output[option] = geneticDefault[option];
      }
    }
    return output;
}
window.compileGenetics = compileGenetics;
window.createGenetics = createGenetics;
let test1 = Genetic.create();
let test2 = createGenetics();
window.test2=test2;
window.test1=test1;
test2.evolve(test2.configuration,geneticDefault.userData);
window.addEventListener('keydown',keyListener);
window.addEventListener('keyup',keyListener);
