import { Ref, ComputedRef, HTMLAttributes, Plugin } from 'vue-demi'
import * as vue from 'vue'

/**
 * @private
 * Recognizer abstract class.
 */
declare abstract class Recognizer<T extends StateKey = StateKey> {
  readonly controller: Controller
  readonly args: any[]
  abstract readonly ingKey: IngKey
  protected debounced: Boolean
  abstract readonly stateKey: T
  /**
   * Creates an instance of a gesture recognizer.
   * @param stateKey drag, move, pinch, etc.
   * @param controller the controller attached to the gesture
   * @param [args] the args that should be passed to the gesture handler
   */
  constructor(controller: Controller, args?: any[])
  get config(): NonNullable<InternalConfig[T]>
  get enabled(): boolean
  get state(): GestureState<T>
  get handler(): NonNullable<InternalHandlers[T]>
  get transform(): (xy: Vector2) => Vector2
  protected updateSharedState(
    sharedState: Partial<SharedGestureState> | null,
  ): void
  protected updateGestureState(
    gestureState: PartialGestureState<T> | null,
  ): void
  protected setTimeout: (
    callback: (...args: any[]) => void,
    ms?: number,
    ...args: any[]
  ) => void
  protected clearTimeout: () => void
  protected abstract getKinematics(
    values: Vector2,
    event: UIEvent,
  ): PartialGestureState<T>
  protected abstract getInternalMovement(
    values: Vector2,
    state: GestureState<T>,
  ): Vector2
  protected abstract mapStateValues(
    state: GestureState<T>,
  ): Omit<PartialGestureState<T>, 'event'>
  abstract addBindings(bindings: any): void
  /**
   * Returns state properties depending on the movement and state.
   *
   * Should be overriden for custom behavior, doesn't do anything in the implementation
   * below.
   */
  protected checkIntentionality(
    _intentional: [false | number, false | number],
    _movement: Vector2,
  ): PartialGestureState<T>
  /**
   * Returns basic movement properties for the gesture based on the next values and current state.
   */
  protected getMovement(values: Vector2): PartialGestureState<T>
  protected clean(): void
  /**
   * Fires the gesture handler
   */
  protected fireGestureHandler: (
    forceFlag?: boolean,
  ) => FullGestureState<T> | null
}

declare type MaybeRef<T> = T | Ref<T> | ComputedRef<T>
declare type GestureTarget = HTMLElement | SVGElement | null | undefined
declare type Omit$1<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
declare type AtLeastOneOf<
  T,
  U = {
    [K in keyof T]: Pick<T, K>
  },
> = Partial<T> & U[keyof U]
declare type Vector2 = [number, number]
declare type Fn = any
interface GenericOptions {
  domTarget: MaybeRef<GestureTarget>
  window?: MaybeRef<GestureTarget>
  eventOptions?: {
    capture?: boolean
    passive?: boolean
  }
  enabled?: boolean
  transform?: (v: Vector2) => Vector2
}
interface GestureOptions<T extends StateKey> {
  enabled?: boolean
  initial?: Vector2 | ((state: State[T]) => Vector2)
  threshold?: number | Vector2
  triggerAllEvents?: boolean
  rubberband?: boolean | number | Vector2
  transform?: (v: Vector2) => Vector2
}
declare type Bounds = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}
declare type CoordinatesConfig<T extends CoordinatesKey> = GestureOptions<T> & {
  axis?: 'x' | 'y'
  lockDirection?: boolean
  bounds?: Bounds | ((state: State[T]) => Bounds)
}
declare type DistanceAngleBounds = {
  min?: number
  max?: number
}
declare type DistanceAngleConfig<T extends DistanceAngleKey> =
  GestureOptions<T> & {
    distanceBounds?:
      | DistanceAngleBounds
      | ((state: State[T]) => DistanceAngleBounds)
    angleBounds?:
      | DistanceAngleBounds
      | ((state: State[T]) => DistanceAngleBounds)
  }
declare type DragConfig = CoordinatesConfig<'drag'> & {
  filterTaps?: boolean
  useTouch?: boolean
  swipeVelocity?: number | Vector2
  swipeDistance?: number | Vector2
  swipeDuration?: number
  preventWindowScrollY?: boolean
  delay?: boolean | number
}
declare type UseDragConfig = GenericOptions & DragConfig
declare type UsePinchConfig = GenericOptions & DistanceAngleConfig<'pinch'>
declare type UseWheelConfig = GenericOptions & CoordinatesConfig<'wheel'>
declare type UseScrollConfig = GenericOptions & CoordinatesConfig<'scroll'>
declare type UseMoveConfig = GenericOptions & CoordinatesConfig<'move'>
declare type UseHoverConfig = GenericOptions
declare type UseGestureConfig = GenericOptions & {
  drag?: DragConfig
  wheel?: CoordinatesConfig<'wheel'>
  scroll?: CoordinatesConfig<'scroll'>
  move?: CoordinatesConfig<'move'>
  pinch?: DistanceAngleConfig<'pinch'>
  hover?: {
    enabled?: boolean
  }
}
interface InternalGenericOptions {
  domTarget: MaybeRef<GestureTarget>
  manual?: boolean
  window?: MaybeRef<GestureTarget>
  eventOptions: {
    capture?: boolean
    passive?: boolean
  }
  enabled: boolean
  transform?: (v: Vector2) => Vector2
}
interface InternalGestureOptions<T extends StateKey> {
  enabled: boolean
  initial: Vector2 | ((state: State[T]) => Vector2)
  threshold: Vector2
  triggerAllEvents: boolean
  rubberband: Vector2
  bounds: [Vector2, Vector2] | ((state: State[T]) => [Vector2, Vector2])
  transform?: (v: Vector2) => Vector2
}
interface InternalCoordinatesOptions<T extends CoordinatesKey>
  extends InternalGestureOptions<T> {
  axis?: 'x' | 'y'
  lockDirection: boolean
}
interface InternalDistanceAngleOptions<T extends DistanceAngleKey>
  extends InternalGestureOptions<T> {}
interface InternalDragOptions extends InternalCoordinatesOptions<'drag'> {
  filterTaps: boolean
  useTouch: boolean
  preventWindowScrollY: boolean
  swipeVelocity: Vector2
  swipeDistance: Vector2
  swipeDuration: number
  delay: number
}
declare type InternalConfig = InternalGenericOptions & {
  drag?: InternalDragOptions
  wheel?: InternalCoordinatesOptions<'wheel'>
  scroll?: InternalCoordinatesOptions<'scroll'>
  move?: InternalCoordinatesOptions<'move'>
  pinch?: InternalDistanceAngleOptions<'pinch'>
  hover?: {
    enabled: boolean
    transform?: (v: Vector2) => Vector2
  }
}
declare type WebKitGestureEvent = PointerEvent & {
  scale: number
  rotation: number
}
declare type DomEvents =
  | TouchEvent
  | PointerEvent
  | WheelEvent
  | UIEvent
  | WebKitGestureEvent
interface EventHandlers {
  onMouseDown?: Fn
  onMouseDownCapture?: Fn
  onMouseEnter?: Fn
  onMouseLeave?: Fn
  onMouseMove?: Fn
  onMouseMoveCapture?: Fn
  onMouseOut?: Fn
  onMouseOutCapture?: Fn
  onMouseOver?: Fn
  onMouseOverCapture?: Fn
  onMouseUp?: Fn
  onMouseUpCapture?: Fn
  onTouchCancel?: Fn
  onTouchCancelCapture?: Fn
  onTouchEnd?: Fn
  onTouchEndCapture?: Fn
  onTouchMove?: Fn
  onTouchMoveCapture?: Fn
  onTouchStart?: Fn
  onTouchStartCapture?: Fn
  onPointerDown?: Fn
  onPointerDownCapture?: Fn
  onPointerMove?: Fn
  onPointerMoveCapture?: Fn
  onPointerUp?: Fn
  onPointerUpCapture?: Fn
  onPointerCancel?: Fn
  onPointerCancelCapture?: Fn
  onPointerEnter?: Fn
  onPointerEnterCapture?: Fn
  onPointerLeave?: Fn
  onPointerLeaveCapture?: Fn
  onPointerOver?: Fn
  onPointerOverCapture?: Fn
  onPointerOut?: Fn
  onPointerOutCapture?: Fn
  onGotPointerCapture?: Fn
  onGotPointerCaptureCapture?: Fn
  onLostPointerCapture?: Fn
  onLostPointerCaptureCapture?: Fn
  onScroll?: Fn
  onScrollCapture?: Fn
  onWheel?: Fn
  onWheelCapture?: Fn
  onGestureStart?: Fn
  onGestureChange?: Fn
  onGestureEnd?: Fn
  onClick?: Fn
  onClickCapture?: Fn
}
declare type EventHandlersKey = keyof EventHandlers
declare type IngKey =
  | 'hovering'
  | 'scrolling'
  | 'wheeling'
  | 'dragging'
  | 'moving'
  | 'pinching'
declare type CoordinatesKey = 'drag' | 'wheel' | 'move' | 'scroll'
declare type DistanceAngleKey = 'pinch'
declare type GestureKey = CoordinatesKey | DistanceAngleKey | 'hover'
declare type StateKey<T extends GestureKey = GestureKey> = T extends 'hover'
  ? 'move'
  : T
declare type SharedGestureState = {
  [ingKey in IngKey]: boolean
} & {
  touches: number
  down: boolean
  buttons: number
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
  locked: boolean
}
declare type EventTypes = {
  drag: PointerEvent
  wheel: WheelEvent
  scroll: UIEvent
  move: PointerEvent
  pinch: TouchEvent | WheelEvent | WebKitGestureEvent
  hover: PointerEvent
}
interface CommonGestureState {
  _active: boolean
  _blocked: boolean
  _intentional: [false | number, false | number]
  _movement: Vector2
  _initial: Vector2
  _bounds: [Vector2, Vector2]
  _lastEventType?: string
  _dragTarget?: GestureTarget | null
  _dragPointerId?: number | null
  _dragStarted: boolean
  _dragPreventScroll: boolean
  _dragIsTap: boolean
  _dragDelayed: boolean
  event?: UIEvent
  intentional: boolean
  values: Vector2
  velocities: Vector2
  delta: Vector2
  movement: Vector2
  offset: Vector2
  lastOffset: Vector2
  initial: Vector2
  previous: Vector2
  direction: Vector2
  first: boolean
  last: boolean
  active: boolean
  startTime: number
  timeStamp: number
  elapsedTime: number
  cancel(): void
  canceled: boolean
  memo?: any
  args?: any
}
interface Coordinates {
  axis?: 'x' | 'y'
  xy: Vector2
  velocity: number
  vxvy: Vector2
  distance: number
}
interface DragState {
  _pointerId?: number
  tap: boolean
  swipe: Vector2
}
interface PinchState {
  _pointerIds: [number, number]
}
interface DistanceAngle {
  da: Vector2
  vdva: Vector2
  origin: Vector2
  turns: number
}
declare type State = {
  shared: SharedGestureState
  drag: CommonGestureState & Coordinates & DragState
  wheel: CommonGestureState & Coordinates
  scroll: CommonGestureState & Coordinates
  move: CommonGestureState & Coordinates
  pinch: CommonGestureState & DistanceAngle & PinchState
}
declare type GestureState<T extends StateKey> = State[T]
declare type PartialGestureState<T extends StateKey> = Partial<GestureState<T>>
declare type FullGestureState<T extends StateKey> = SharedGestureState &
  State[T]
declare type Handler<T extends GestureKey, K = EventTypes[T]> = (
  state: Omit$1<FullGestureState<StateKey<T>>, 'event'> & {
    event: K
  },
) => any | void
declare type InternalHandlers = {
  [Key in GestureKey]?: Handler<Key, any>
}
declare type NativeHandlersKeys = keyof Omit$1<
  HTMLAttributes,
  keyof UserHandlers & keyof HTMLAttributes
>
declare type AnyGestureEventTypes = Partial<
  {
    drag: any
    wheel: any
    scroll: any
    move: any
    pinch: any
    hover: any
  } & {
    [key in NativeHandlersKeys]: any
  }
>
declare type check<
  T extends AnyGestureEventTypes,
  Key extends GestureKey,
> = undefined extends T[Key] ? EventTypes[Key] : T[Key]
declare type UserHandlers<T extends AnyGestureEventTypes = EventTypes> = {
  onDrag: Handler<'drag', check<T, 'drag'>>
  onDragStart: Handler<'drag', check<T, 'drag'>>
  onDragEnd: Handler<'drag', check<T, 'drag'>>
  onPinch: Handler<'pinch', check<T, 'pinch'>>
  onPinchStart: Handler<'pinch', check<T, 'pinch'>>
  onPinchEnd: Handler<'pinch', check<T, 'pinch'>>
  onWheel: Handler<'wheel', check<T, 'wheel'>>
  onWheelStart: Handler<'wheel', check<T, 'wheel'>>
  onWheelEnd: Handler<'wheel', check<T, 'wheel'>>
  onMove: Handler<'move', check<T, 'move'>>
  onMoveStart: Handler<'move', check<T, 'move'>>
  onMoveEnd: Handler<'move', check<T, 'move'>>
  onScroll: Handler<'scroll', check<T, 'scroll'>>
  onScrollStart: Handler<'scroll', check<T, 'scroll'>>
  onScrollEnd: Handler<'scroll', check<T, 'scroll'>>
  onHover: Handler<'hover', check<T, 'hover'>>
}
declare type RecognizerClass = {
  new (controller: Controller, args: any): Recognizer
}
declare type NativeHandlers<T extends AnyGestureEventTypes = {}> = {
  [key in NativeHandlersKeys]: (
    state: SharedGestureState & {
      event: undefined extends T[key] ? Event : T[key]
      args: any
    },
    ...args: any
  ) => void
}
declare type Handlers<T extends AnyGestureEventTypes = EventTypes> = Partial<
  UserHandlers<T> & NativeHandlers<T>
>
declare type HookReturnType<
  T extends {
    domTarget: MaybeRef<GestureTarget>
  },
> = T['domTarget']

/**
 * The controller will keep track of the state for all gestures and also keep
 * track of timeouts, and window listeners.
 */
declare class Controller {
  private classes
  nativeRefs: any
  config: InternalConfig
  handlers: InternalHandlers
  state: State
  timeouts: {
    [stateKey in StateKey]?: number
  }
  domListeners: [string, Fn][]
  windowListeners: {
    [stateKey in StateKey]?: [string, Function][]
  }
  pointerIds: Set<number>
  touchIds: Set<number>
  supportsTouchEvents: boolean
  supportsGestureEvents: boolean
  constructor(classes: Set<RecognizerClass>)
  bind: (...args: any[]) => void | EventHandlers
  /**
   * Function ran on component unmount: cleans timeouts and removes dom listeners set by the bind function.
   */
  clean: () => void
}

/**
 * Drag hook.
 *
 * @param handler - the function fired every time the drag gesture updates
 * @param [config={}] - the config object including generic options and drag options
 */
declare function useDrag<K = EventTypes['drag']>(
  handler: Handler<'drag', K>,
  config?: UseDragConfig | {},
): Controller

/**
 * @public
 *
 * The most complete gesture hook, allowing support for multiple gestures.
 *
 * @param {Handlers} handlers - an object with on[Gesture] keys containg gesture handlers
 * @param {UseGestureConfig} [config={}] - the full config object
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
declare function useGesture<T extends AnyGestureEventTypes = EventTypes>(
  _handlers: Handlers<T>,
  config: UseGestureConfig,
): Controller

/**
 * Hover hook.
 *
 * @param handler - the function fired every time the hover gesture updates
 * @param [config={}] - the config object including generic options and hover options
 */
declare function useHover<K = EventTypes['hover']>(
  handler: Handler<'hover', K>,
  config?: UseHoverConfig | {},
): Controller

/**
 * Move hook.
 *
 * @param handler - the function fired every time the move gesture updates
 * @param [config={}] - the config object including generic options and move options
 */
declare function useMove<K = EventTypes['move']>(
  handler: Handler<'move', K>,
  config?: UseMoveConfig | {},
): Controller

/**
 * Pinch hook.
 *
 * @param handler - the function fired every time the pinch gesture updates
 * @param [config={}] - the config object including generic options and pinch options
 */
declare function usePinch<K = EventTypes['pinch']>(
  handler: Handler<'pinch', K>,
  config?: UsePinchConfig | {},
): Controller

/**
 * Scroll hook.
 *
 * @param handler - the function fired every time the scroll gesture updates
 * @param [config={}] - the config object including generic options and scroll options
 */
declare function useScroll<K = EventTypes['scroll']>(
  handler: Handler<'scroll', K>,
  config?: UseScrollConfig | {},
): Controller

/**
 * Wheel hook.
 *
 * @param handler - the function fired every time the wheel gesture updates
 * @param the config object including generic options and wheel options
 */
declare function useWheel<K = EventTypes['wheel']>(
  handler: Handler<'wheel', K>,
  config?: UseWheelConfig | {},
): Controller

declare const drag: () => vue.Directive<HTMLElement | SVGElement, any>
declare const move: () => vue.Directive<HTMLElement | SVGElement, any>
declare const hover: () => vue.Directive<HTMLElement | SVGElement, any>
declare const pinch: () => vue.Directive<HTMLElement | SVGElement, any>
declare const wheel: () => vue.Directive<HTMLElement | SVGElement, any>
declare const scroll: () => vue.Directive<HTMLElement | SVGElement, any>

declare const GesturePlugin: Plugin

declare function addV<T extends number[]>(v1: T, v2: T): T
declare function subV<T extends number[]>(v1: T, v2: T): T

declare function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  constant?: number,
): number

export {
  AnyGestureEventTypes,
  AtLeastOneOf,
  Bounds,
  CommonGestureState,
  Coordinates,
  CoordinatesConfig,
  CoordinatesKey,
  DistanceAngle,
  DistanceAngleBounds,
  DistanceAngleConfig,
  DistanceAngleKey,
  DomEvents,
  DragConfig,
  DragState,
  EventHandlers,
  EventHandlersKey,
  EventTypes,
  Fn,
  FullGestureState,
  GenericOptions,
  GestureKey,
  GestureOptions,
  GesturePlugin,
  GestureState,
  GestureTarget,
  Handler,
  Handlers,
  HookReturnType,
  IngKey,
  InternalConfig,
  InternalCoordinatesOptions,
  InternalDistanceAngleOptions,
  InternalDragOptions,
  InternalGenericOptions,
  InternalGestureOptions,
  InternalHandlers,
  MaybeRef,
  NativeHandlers,
  Omit$1 as Omit,
  PartialGestureState,
  PinchState,
  RecognizerClass,
  SharedGestureState,
  State,
  StateKey,
  UseDragConfig,
  UseGestureConfig,
  UseHoverConfig,
  UseMoveConfig,
  UsePinchConfig,
  UseScrollConfig,
  UseWheelConfig,
  UserHandlers,
  Vector2,
  WebKitGestureEvent,
  addV,
  drag as dragDirective,
  hover as hoverDirective,
  move as moveDirective,
  pinch as pinchDirective,
  rubberbandIfOutOfBounds,
  scroll as scrollDirective,
  subV,
  useDrag,
  useGesture,
  useHover,
  useMove,
  usePinch,
  useScroll,
  useWheel,
  wheel as wheelDirective,
}
