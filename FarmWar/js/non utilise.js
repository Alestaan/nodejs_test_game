
      canvasElement.onmousemove = function(event) 
	  {
	  
		// On obtient les coordonn�s au survole de l'objet
        var puv = {
          u:event.clientX - sheetengine.canvas.offsetLeft, 
          v:event.clientY - sheetengine.canvas.offsetTop
        };
        
		// v�rifie si l'objet a �t� survol� ou pas
        var objhovered = isObjectHovered(puv);
        if (objhovered != hover)
          scenechanged = true;
        hover = objhovered;
      }
	 
      
      function isObjectHovered(puv) 
	  {
        var ouv = sheetengine.drawing.getPointuv(obj.centerp);
        if (puv.u > ouv.u - 20 &&
          puv.u < ouv.u - 20 + 40 &&
          puv.v > ouv.v - 30 &&
          puv.v < ouv.v - 30 + 40)
          return true;
        
        return false;
      }			
	  
	  
	  // dans l'evenement on click
	  // V�rifie si l'objet a �t� cliqu�
			if (hover) 
			{
			  hover = false;
			  // Bouge l'objet a une position au hasard
			  obj.setPosition({x:Math.random() * 500 - 250, y:Math.random() * 500 - 250, z:0});
			  scenechanged = true;
			  return;
			}
	  
	  
	  
	  //main loop
	  // fonction qui dessine un carr� blanc au hover de l'objet
	    if (hover) 
		  { 
            var ctx = sheetengine.context;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = '#FFF';
            var ouv = sheetengine.drawing.getPointuv(obj.centerp);
            ctx.strokeRect(Math.round(ouv.u) - 20, Math.round(ouv.v) - 30, 40, 40);
            ctx.restore();
          }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 //save
	  /**********************************/
	 /*          PLAYER                     */
	/*********************************/
      
      // fonction d'animation du personnage
      function animateCharacter(character) 
	  {
        var state = Math.floor( (character.animationState % 8) / 2);
        var dir = (state == 0 || state == 3) ? 1 : -1;
        
        character.rotateSheet(character.leg1, {x:0,y:0,z:8}, {x:1,y:0,z:0}, dir * Math.PI/8);
        character.rotateSheet(character.leg2, {x:0,y:0,z:8}, {x:1,y:0,z:0}, -dir * Math.PI/8);
      }      
      
      // d�finit un caract�re
      var character = defineCharacter({x:0,y:0,z:0});
	  loadAndRemoveSheets({x:0,y:0}, centertile);
	 
      // D�ssine les objets rajouter
      sheetengine.calc.calculateAllSheets();
      sheetengine.drawing.drawScene(true);
      
	  
      function setKeys(event, val) 
	  {
	  
      var target = null;
      var hover = false;
      var scenechanged = false;

      // Fonctions qui g�re les d�pacements � la souris
      canvasElement.onclick = function(event) 
		{
			// Variables pour obtenir les coordonn�s des cliques de souris
			var puv = {
			  u:event.clientX - sheetengine.canvas.offsetLeft, 
			  v:event.clientY - sheetengine.canvas.offsetTop
			};
			

			
			// transforme les coordonn�s du monde en coordonn�s syst�me
			var pxy = sheetengine.transforms.inverseTransformPoint
			({
			  u:puv.u + sheetengine.scene.center.u, 
			  v:puv.v + sheetengine.scene.center.v
			});
			
			// Calcul l'angle de rotation
			var angle = -Math.atan2(pxy.y - character.centerp.y, pxy.x - character.centerp.x) + Math.PI/2;

			// d�finit la position cible d'un caract�re
			target = pxy;
			scenechanged = true;

			// d�finit l'orientation absolue avec respect de la position initial de l'objet /*
		   character.setOrientation({alpha: 0, beta: 0, gamma: angle});
		}
	  

	  
	    // Boucle principale
      function mainloop() 
	  {
        var move = 0;
		
        if (target) 
		{
          if (Math.abs(target.x-character.centerp.x) > 5 || Math.abs(target.y-character.centerp.y) > 5)
            move = 5;
		}
		
		if (move) 
		{
			// Calcule afin de d�finir l'orinetation du personnage
			var angle = character.rot.gamma;
			var dx = Math.sin(angle) * move;
			var dy = Math.cos(angle) * move;
					
			// D�placement du personnage au point cibl�
			character.move({x:dx,y:dy,z:0});

			animateCharacter(character);
			character.animationState++;

			scenechanged = true;
			  
			 // V�rifie si le joueur a boug� loin du centre, dans ce cas la on chargera la nouvelle zone
			var oldcentertile = { x:centertile.x, y:centertile.y };
			centertile.x = Math.round(character.centerp.x / 200);
			centertile.y = Math.round(character.centerp.y / 200);
				
			if (centertile.x != oldcentertile.x || centertile.y != oldcentertile.y) 
			{
			  loadAndRemoveSheets(oldcentertile, centertile);
				  
			  // Calcul toutes les formes et redessine la sc�ne enti�re
			  sheetengine.calc.calculateAllSheets();
			  sheetengine.drawing.drawScene(true);				
			} else 
			{
			  // calcul des formes qui ont chang�s et redessine les nouvelle r�gions
			  sheetengine.calc.calculateChangedSheets();
			  sheetengine.drawing.drawScene();
			}
		}
	    
		// Enl�ve la croix si le personnage a atteind sa destination
        if (target && !move) 
		{
          target = null;
          scenechanged = true;
        }
		    
        if (scenechanged) 
		{
          scenechanged = false;

			// Camera centr� sur l'objet joueur cr�e
			sheetengine.scene.setCenter(character.centerp);
	 
			// Mise � jours et calcul des dessins afin de les redessiner
			sheetengine.calc.calculateChangedSheets();
			sheetengine.drawing.drawScene();
          
          if (target) 
		  {
            // D�ssine un X � l'emplacement cliqu�
            var ctx = sheetengine.context;
            ctx.save();
            ctx.scale(1, 0.5);
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#FFF';
            var puv = sheetengine.drawing.getPointuv(target);
            ctx.beginPath();
            ctx.moveTo(puv.u-5, puv.v*2-5);
            ctx.lineTo(puv.u+5, puv.v*2+5);
            ctx.moveTo(puv.u+5, puv.v*2-5);
            ctx.lineTo(puv.u-5, puv.v*2+5);
            ctx.stroke();
            ctx.restore();
          }
        }
      }; setInterval(mainloop, 30);