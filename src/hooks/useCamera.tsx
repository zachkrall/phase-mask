import { useState, useEffect, useRef } from 'react';

const useCamera = () => {
  const stream = useRef<any>(null);
  const [id, setId] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const [devices, setDevices] = useState([]);

  const requestDeviceList = () => {
    let formatDeviceList = arr =>
      [...arr]
        .filter(d => d.kind === 'videoinput')
        .map((d, i) => ({
          name: d.label || 'camera ' + (i + 1),
          id: d.deviceId
        }));

    navigator.mediaDevices
      .enumerateDevices()
      .then(media => {
        setDevices(() => formatDeviceList(media));
      })
      .catch(e => {
        setError(e);
      });
  };

  const requestCamera = (id?) => {
    let constraints: any = {
      audio: false,
      video: true
    };

    if (id) {
      constraints['video'] = {
        deviceId: {
          exact: id
        }
      };
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(s => {
        console.log(constraints);
        console.log('hook stream', s);
        stream.current = s;
        setId(s.id);
      })
      .catch(e => {
        setError(e);
      });
  };

  return {
    stream,
    devices,
    requestCamera,
    requestDeviceList,
    error,
    id
  };
};

export default useCamera;
