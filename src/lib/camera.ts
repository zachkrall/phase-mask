export const defaultConstraints: MediaStreamConstraints = {
  audio: false,
  video: true,
}

export type Device = {
  deviceId: MediaDeviceInfo['deviceId']
  groupId: MediaDeviceInfo['groupId']
  kind: MediaDeviceInfo['kind']
  label: MediaDeviceInfo['label']
}

export const MediaDeviceToModel = (i: MediaDeviceInfo): Device => {
  return {
    deviceId: i.deviceId,
    groupId: i.groupId,
    kind: i.kind,
    label: i.label,
  }
}

export const requestCameraPermissions = async ({
  id,
  constraints = defaultConstraints,
}: {
  id?: string
  constraints?: MediaStreamConstraints
} = {}): Promise<[MediaStream, null] | [null, Error]> => {
  const c = constraints

  if (id) {
    c.video = {
      deviceId: {
        exact: id,
      },
    }
  }

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia(c)
      .then((stream: MediaStream) => {
        resolve([stream, null])
      })
      .catch(() => {
        resolve([null, new Error('Unable to access media')])
      })
  })
}

export const requestDeviceList = async (): Promise<[Device[], null] | [null, Error]> => {
  const filterDeviceList = (arr: MediaDeviceInfo[]) => {
    return arr.filter(device => device.kind === 'videoinput').map(MediaDeviceToModel)
  }
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        resolve([filterDeviceList(devices), null])
      })
      .catch(() => {
        resolve([null, new Error('Unable to generate media list')])
      })
  })
}
