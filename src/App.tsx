import * as C from './App.styles';
import logoImg from './headerimg/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { InfoItem } from './components/infoItem';
import { Button } from './components/button';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/gridItemType';
import {items} from './data/items'
import { GridItem } from './components/GridItem';
import { formatTime } from './helpers/formatTime';



const App = () => {

  const[playing, setPlaying] = useState<boolean>(false);
  const[timeElapsed, setTimeElapsed] = useState<number>(0);
  const[moveCount, setMoveCount] = useState<number>(0);
  const[shownCont, setShownCont] = useState<number>(0);
  const[gridItems, setGridItems] = useState<GridItemType[]>([]);


  useEffect(() => resetAndCreateGrid(), []);

  //verifica se o jogo começou, se sim, dispara o cronometro.
  useEffect(() => {
    const time = setInterval(() => {
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000)
    return () => clearInterval(time);
  }, [playing,timeElapsed]);

  // verificar se tem no minimo 2 cards virados e se são iguais, sendo iguais, deixa permanente, se não vira novamente.
  useEffect(() => {
    if(shownCont === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {
        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true
              tmpGrid[i].shown = false
            }
          
          }
        
          setGridItems(tmpGrid);
          setShownCont(0);
        } else {
            setTimeout(() => {
              let tmpGrid = [...gridItems];
              for(let i in tmpGrid) {
                tmpGrid[i].shown = false;
              }
              setGridItems(tmpGrid);
              setShownCont(0);
            }, 1000);
        }
        setMoveCount(moveCount => moveCount +1);
      }
    }
  }, [shownCont, gridItems]);

  //verificar se o jogo terminou
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);


  const resetAndCreateGrid = () => {
    // passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCont(0);
    setGridItems([]);

    // passo 2 - criar o grid
    // 2.1 - criar o grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    // 2.2 - preencher o grid
    for(let w = 0; w < 2; w++)
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }

    // 2.3 - jogar no state
    setGridItems(tmpGrid);

    // passo 3 - começar o jogo
    setPlaying(true);

  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCont < 2) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCont(shownCont + 1);
      }

      setGridItems(tmpGrid);
    }
  }
  
  return (
    <C.Container>
      <C.Info>
          <C.logoLink>
            <img src={logoImg} width='200' alt=''/>
          </C.logoLink>

          <C.infoArea>
            <InfoItem label='Tempo' value={formatTime(timeElapsed)}/>
            <InfoItem label='Movimentos' value={moveCount.toString()}/>
          </C.infoArea>

          <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}/>
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
              <GridItem 
                  key={index}
                  item={item}
                  onClick={() => handleItemClick(index)}
              />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;
