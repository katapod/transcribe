import BuildingIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';

type IconComponent = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
  }
>;
export interface Subscription {
  name: string;
  icon: {
    component: IconComponent;
    color: string;
  };
  price: {
    monthly: number;
    yearly: number;
    perMinute: number;
  };
  freeMinutes?: number;
  description: string;
  features: Array<Feature>;
}

export interface Feature {
  name: string;
  description: string;
  note?: FeatureNote;
}
export type FeatureNote = string;

export const plans: Array<Subscription> = [
  {
    name: 'Basic',
    icon: {
      component: UserIcon,
      color: '#3ab77d',
    },
    price: {
      monthly: 0,
      yearly: 0,
      perMinute: 0.01,
    },
    description: 'For individuals and small teams',
    features: [
      {
        name: 'Unlimited Parallel Real-time Transcriptions',
        description: 'Unlimited Transcriptions in real-time',
      },
      {
        name: 'Unlimited Transcription History',
        description: 'Access to your transcription history',
      },
      {
        name: '60+ Audio Languages',
        description: 'Support for 60+ languages',
      },
      {
        name: 'Translate to English',
        description: 'Translate to English',
      },
      {
        name: 'AI prompting',
        description: 'AI prompt injection',
      },
      {
        name: 'Charged per second',
        description: 'Charged to the nearest second of audio',
      },
      {
        name: 'Transcription Cost',
        description: 'Cost per minute for Transcribing (Rounded up to the nearest second)',
        note: `$0.01 per minute`,
      },
      {
        name: 'Upload Files',
        description: 'Upload files to be transcribed',
      },
      {
        name: 'Record Audio',
        description: 'Record audio to be transcribed',
      },
      {
        name: 'Export Transcriptions',
        description: 'Export transcriptions as text files',
      },
    ],
  },
  {
    name: 'Pro',
    icon: { component: UsersIcon, color: '#3a66b7' },
    price: {
      monthly: 5,
      yearly: 50,
      perMinute: 0.008,
    },
    freeMinutes: 500,
    description: 'For small teams and businesses',
    features: [
      {
        name: 'Transcription Cost',
        description: 'Cost per minute for Transcribing (Rounded up to the nearest second)',
        note: `$0.008 per minute`,
      },
    ],
  },
  {
    name: 'Business',
    icon: { component: BuildingIcon, color: '#b7423a' },
    price: {
      monthly: 15,
      yearly: 150,
      perMinute: 0.007,
    },
    freeMinutes: 1500,
    description: 'For large teams and businesses',
    features: [
      {
        name: 'Transcription Cost',
        description: 'Cost per minute for Transcribing (Rounded up to the nearest second)',
        note: `$0.007 per minute`,
      },
    ],
  },
];
