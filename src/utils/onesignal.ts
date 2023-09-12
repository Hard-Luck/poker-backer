import OneSignal from "react-onesignal";
import * as dotenv from "dotenv";

dotenv.config();

const key = process.env.NEXT_PUBLIC_ONESIGNAL_KEY;

export function runOneSignal(): Promise<void | null> {
  if (key) {
    return OneSignal.init({
      appId: key,
      allowLocalhostAsSecureOrigin: true,
    })
      .then(() => {
        return OneSignal.Slidedown.promptPush();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return Promise.resolve(null);
}
