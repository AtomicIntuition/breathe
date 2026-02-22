// Web Bluetooth API type declarations
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[]
  name?: string
  namePrefix?: string
  manufacturerData?: { companyIdentifier: number }[]
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[]
  optionalServices?: BluetoothServiceUUID[]
  acceptAllDevices?: boolean
}

interface BluetoothDevice extends EventTarget {
  readonly id: string
  readonly name?: string
  readonly gatt?: BluetoothRemoteGATTServer
  addEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
  removeEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
}

interface BluetoothRemoteGATTServer {
  readonly device: BluetoothDevice
  readonly connected: boolean
  connect(): Promise<BluetoothRemoteGATTServer>
  disconnect(): void
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>
}

interface BluetoothRemoteGATTService {
  readonly device: BluetoothDevice
  readonly uuid: string
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>
}

interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  readonly service: BluetoothRemoteGATTService
  readonly uuid: string
  readonly value?: DataView
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  readValue(): Promise<DataView>
  addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
  removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
}

type BluetoothServiceUUID = number | string
type BluetoothCharacteristicUUID = number | string

interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>
}

interface Navigator {
  bluetooth?: Bluetooth
}
