import { TileType, TileStatus } from '@/modules/TileEnums.mjs'

class TileProperties {
  private _x: number
  private _y: number
  private _coordinates: string
  private _id: string
  private _tileType: TileType
  private _starCount: number
  private _tileStatus: TileStatus
  private _starOpened: boolean
  private _highlighted: boolean

  constructor(x: number, y: number, randomKey: number) {
    this._x = x
    this._y = y
    this._coordinates = `${this._x},${this._y}`
    this._id = this._coordinates + randomKey
    this._tileType = TileType.Empty
    this._starCount = 0
    this._tileStatus = TileStatus.Unopened
    this._starOpened = false
    this._highlighted = false
  }

  public resetProperties(): void {
    this._tileType = TileType.Empty
    this._starCount = 0
    this._tileStatus = TileStatus.Unopened
    this._starOpened = false
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

  public get id(): string {
    return this._id
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

  public get starOpened(): boolean {
    return this._starOpened
  }
  public set starOpened(value: boolean) {
    this._starOpened = value
  }

  public get highlighted(): boolean {
    return this._highlighted
  }
  public set highlighted(value: boolean) {
    this._highlighted = value
  }
}

export { TileProperties }
