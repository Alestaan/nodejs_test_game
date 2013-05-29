 window.onload = function() 
{
   var canvasElement = document.getElementById('maincanvas');
   sheetengine.scene.init(canvasElement, {w:900,h:600});
   
	 //world tiles
	 var centertile = {x:0,y:0};
	 var map = [];

		for (var x=-3; x<=3; x++) 
		{
			for (var y=-3; y<=3; y++) 
			{
				map.push
				({
					centerp: { x: x * 200, y: y * 200, z: 0 },
					orientation: {alphaD: 90, betaD: 0, gammaD: 0},
					size: {w:200,h:200},
				
					init: function() 
					{ 
					 var basesheet = new sheetengine.BaseSheet(this.centerp, this.orientation, this.size);
					 
					 //random sur les couleurs des tiles
					 var random = Math.floor((Math.random()*3)+1);
				 
					 if( random == 1) { var couleur_random='#5D7E36'; }
					 if( random == 2) { var couleur_random='#108720'; }
					 if( random == 3) { var couleur_random='#5F991C'; }
					 basesheet.color = couleur_random;
					  return basesheet;
					}
				});
			}
		}

	 new_player(canvasElement, centertile, map);
	 natural_environment();
	 //natural_event();
	   
      // Déssine le monde
      sheetengine.calc.calculateAllSheets();
      sheetengine.drawing.drawScene(true); 
}
