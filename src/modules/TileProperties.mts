import { TileType, TileStatus } from './TileEnums.mjs'

class TileProperties {
  private _x: number
  private _y: number
  private _coordinates: string
  private _tileType: TileType
  private _starCount: number
  private _tileStatus: TileStatus

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
    this._coordinates = `${this._x},${this._y}`
    this._tileType = TileType.Empty
    this._starCount = 0
    this._tileStatus = TileStatus.Unopened
  }

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }

  public get coordinates(): string {
    return this._coordinates
  }

  public get tileType(): TileType {
    return this._tileType
  }
  public set tileType(value: TileType) {
    this._tileType = value
  }

  public get starCount(): number {
    return this._starCount
  }
  public set starCount(value: number) {
    this._starCount = value
  }

  public get tileStatus(): TileStatus {
    return this._tileStatus
  }
  public set tileStatus(value: TileStatus) {
    this._tileStatus = value
  }
}

export { TileProperties }
