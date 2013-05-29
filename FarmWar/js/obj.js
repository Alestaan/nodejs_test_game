function natural_environment()
{
	// Caisse blanche
      var sheet1 = new sheetengine.Sheet({x:150,y:20,z:20}, {alphaD:0,betaD:0,gammaD:0}, {w:40,h:40});
      sheet1.context.fillStyle = '#FFF';
      sheet1.context.fillRect(0,0,40,40);

      var sheet2 = new sheetengine.Sheet({x:170,y:0,z:20}, {alphaD:0,betaD:0,gammaD:90}, {w:40,h:40});
      sheet2.context.fillStyle = '#FFF';
      sheet2.context.fillRect(0,0,40,40);

      var sheet3 = new sheetengine.Sheet({x:150,y:0,z:40}, {alphaD:90,betaD:0,gammaD:0}, {w:40,h:40});
      sheet3.context.fillStyle = '#FFF';
      sheet3.context.fillRect(0,0,40,40);
	  
	  //Le fake pont blanc
	  var sheet = new sheetengine.Sheet({x:-29,y:200,z:11}, {alphaD:90,betaD:00,gammaD:20}, {w:60,h:60});
      sheet.context.fillStyle = '#FFF';
      sheet.context.fillRect(0,0,60,60);
      sheet = new sheetengine.Sheet({x:28,y:200,z:11}, {alphaD:90,betaD:00,gammaD:-20}, {w:60,h:60});
      sheet.context.fillStyle = '#FFF';
      sheet.context.fillRect(0,0,60,60);
	 
      
      // Arbre simple
      var sheet4 = new sheetengine.Sheet({x:-150,y:-120,z:40}, {alphaD:0,betaD:0,gammaD:0}, {w:80,h:80});
      var sheet5 = new sheetengine.Sheet({x:-150,y:-120,z:40}, {alphaD:0,betaD:0,gammaD:90}, {w:80,h:80});
      
      function drawPineTexture(context) 
	  {
        context.fillStyle='#BDFF70';
        context.beginPath();
        context.moveTo(40,0);
        context.lineTo(60,30);
        context.lineTo(50,30);
        context.lineTo(70,60);
        context.lineTo(10,60);
        context.lineTo(30,30);
        context.lineTo(20,30);
        context.fill();
        context.fillStyle='#725538';
        context.fillRect(35,60,10,20);
      }
      
      drawPineTexture(sheet4.context);
      drawPineTexture(sheet5.context);	  
	  
	   // generate a density map from the sheets
	  var densityMap = new sheetengine.DensityMap(5);
      densityMap.addSheets(sheetengine.sheets);
	  
}