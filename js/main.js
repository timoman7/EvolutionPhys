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
window.engine = engine;
window.render = render;
let screen = document.querySelector("canvas");
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
      let xVal = Math.min(Math.max(Math.random()*screen.width,0),screen.width);
      initVals.push(xVal);
    }else if(i < 2){
      let yVal = Math.min(Math.max(Math.random()*screen.height,0),screen.height);
      initVals.push(yVal);
    }else if(i < 4){
      let dim = Math.floor((Math.random()+1)*50);
      initVals.push(dim);
    }else{
      let v = ((Math.random()-0.5)*2)*5;
      afterVals.push(v);
    }
  }
  ent.concat(initVals,afterVals);
  let box_ = Bodies.rectangle(...initVals);
  World.add(engine.world, box_);
  return ent;
}
function defaultFitness(ent){
  let dist = Math.sqrt(Math.pow(this.userData.target.x - ent.position.x,2)+Math.pow(this.userData.target.y - ent.position.y,2));
  let fit = 1 / dist;
  return fit;
}
function defaultMutate(ent){
  let drift = ((Math.random()-0.5)*2);
  let index = Math.floor(Math.random()*ent.length);
  ent[index] += drift;
  return ent;
}
function defaultGeneration(pop, generation, stats){

}
//Will add later
function defaultCrossover(m,f){


}
const geneticDefault = {
  "seed": defaultSeed,
  "mutate": defaultMutate,
  "fitness": defaultFitness,
  "generation": defaultGeneration,
  "optimize": Genetic.Optimize.Maximize,
  "select1": Genetic.Select1.Tournament3,
  "select2": null,
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
    }
  },
};

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
    console.log(option,output[option])
  }
  return output;
}
window.compileGenetics = compileGenetics;
window.test1 = Genetic.create();
window.test2 = compileGenetics(test1);

window.addEventListener('keydown',keyListener);
window.addEventListener('keyup',keyListener);
