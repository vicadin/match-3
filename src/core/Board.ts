import { GAME_CONFIG } from '@/config/gameConfig';
import { GEMS } from '@/config/boardConfig';
import { Gem } from '@/model/Gem';
import { randomItem } from '@/utils/random';


export class Board {

  readonly rows = GAME_CONFIG.board.rows;
  readonly cols = GAME_CONFIG.board.cols;


  private nextId = 0;


  grid: (Gem | null)[][] = [];


  constructor() {
    this.generate();
  }


  private generate(): void {

    this.grid = [];


    for (let row = 0; row < this.rows; row++) {

      const line: (Gem | null)[] = [];


      for (let col = 0; col < this.cols; col++) {

        line.push(
          this.createGem(row, col)
        );

      }


      this.grid.push(line);
    }


    this.removeInitialMatches();
  }



  private createGem(
    row:number,
    col:number
  ):Gem {


    return {

      id:this.nextId++,

      type:randomItem(GEMS).id,

      row,

      col,

    };

  }



  get(
    row:number,
    col:number
  ):Gem {


    return this.grid[row][col] as Gem;

  }



  set(
    row:number,
    col:number,
    gem:Gem|null
  ):void {


    if(gem){

      gem.row=row;
      gem.col=col;

    }


    this.grid[row][col]=gem;

  }




  swap(
    a:Gem,
    b:Gem
  ):void {


    const aRow=a.row;
    const aCol=a.col;


    this.set(
      a.row,
      a.col,
      b
    );


    this.set(
      b.row,
      b.col,
      a
    );


    a.row=b.row;
    a.col=b.col;


    b.row=aRow;
    b.col=aCol;

  }





  findMatches():Gem[][] {


    const matches:Gem[][]=[];



    // horizontal

    for(
      let row=0;
      row<this.rows;
      row++
    ){

      let chain:Gem[]=[];


      for(
        let col=0;
        col<this.cols;
        col++
      ){

        const gem=this.grid[row][col];


        if(
          gem &&
          (
            chain.length===0 ||
            chain[0].type===gem.type
          )
        ){

          chain.push(gem);

        }
        else {


          if(chain.length>=3){

            matches.push(chain);

          }


          chain=gem ? [gem] : [];

        }

      }



      if(chain.length>=3){

        matches.push(chain);

      }

    }





    // vertical

    for(
      let col=0;
      col<this.cols;
      col++
    ){

      let chain:Gem[]=[];


      for(
        let row=0;
        row<this.rows;
        row++
      ){

        const gem=this.grid[row][col];


        if(
          gem &&
          (
            chain.length===0 ||
            chain[0].type===gem.type
          )
        ){

          chain.push(gem);

        }
        else {


          if(chain.length>=3){

            matches.push(chain);

          }


          chain=gem ? [gem] : [];

        }

      }



      if(chain.length>=3){

        matches.push(chain);

      }

    }


    return matches;

  }





  removeMatches(
    matches:Gem[][]
  ):void {


    const remove=new Set<Gem>();


    matches.forEach(group=>{

      group.forEach(gem=>{

        remove.add(gem);

      });

    });



    remove.forEach(gem=>{

      this.grid[gem.row][gem.col]=null;

    });


  }






  collapse():void {


    for(
      let col=0;
      col<this.cols;
      col++
    ){


      let writeRow=this.rows-1;



      for(
        let row=this.rows-1;
        row>=0;
        row--
      ){


        const gem=this.grid[row][col];


        if(gem){

          this.set(
            writeRow,
            col,
            gem
          );


          if(writeRow!==row){

            this.grid[row][col]=null;

          }


          writeRow--;

        }

      }


    }

  }





  refill():Gem[] {


    const created:Gem[]=[];



    for(
      let col=0;
      col<this.cols;
      col++
    ){


      for(
        let row=0;
        row<this.rows;
        row++
      ){


        if(!this.grid[row][col]){


          const gem=this.createGem(
            row,
            col
          );


          this.grid[row][col]=gem;


          created.push(gem);

        }

      }

    }


    return created;

  }






  removeInitialMatches():void {


    while(
      this.findMatches().length
    ){

      const matches=this.findMatches();

      this.removeMatches(matches);

      this.collapse();

      this.refill();

    }

  }






  isInside(
    row:number,
    col:number
  ):boolean {


    return (
      row>=0 &&
      row<this.rows &&
      col>=0 &&
      col<this.cols
    );

  }



  getNeighbours(
    gem:Gem
  ):Gem[] {


    const result:Gem[]=[];


    const directions=[
      [1,0],
      [-1,0],
      [0,1],
      [0,-1]
    ];



    directions.forEach(
      ([dr,dc])=>{


        const row=gem.row+dr;
        const col=gem.col+dc;


        if(this.isInside(row,col)){

          const neighbour=this.grid[row][col];


          if(neighbour){

            result.push(neighbour);

          }

        }

      }
    );


    return result;

  }

}