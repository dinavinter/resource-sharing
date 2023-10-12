
// Examples of the system's data structure

export class examples {
  // 1. organizations & people
 public orgs: Organization[] =[ {
    id: '123',
    name: 'hospital',
    desc: 'a good place to volunteer',
    available: {
      'food box': [
        {
          quantity: 1,
          location: 'BEER SHEVA',
        },
      ],
    },
    missing: {
      volunteer: [
        {
          quantity: 1,
          location: 'TLV',
          when: [{ before: new Date(), after: new Date() }], // tomorrow
        },
      ],
      'comat-vest': [
        {
          name: 'combat vest',
          quantity: 3,
          location: 'TLV',
          category: 'combat-vest',
          when: [{ before: new Date(), after: new Date() }], // tomorrow
        },
      ],
    },
  }];

public persons: Person[] = [
  {
    id: '456',
    name: 'zonush',
    available: {
      volunteer: [
        {
          quantity: 1,
          location: 'TLV',
        },
      ],
      transport: [
        {
          category: 'vehicle',
          quantity: 1,
          location: 'TLV',
          target: 'BEER SHEVA',
          when: [{ before: new Date(), after: new Date() }], // tomorrow
        },
      ],
    },
  }, {
    id: 'baryo',
    name: 'baryo',
    missing: {
      'food box': [
        {
          quantity: 1,
          location: 'BEER SHEVA',
        },
      ],
    },
  }];

  // 2. system matched "456--volunteer-->hospital", notified them to connect, suggests to approve transaction
  // 3. when one of the parties confirms, their missing/available quantity updates + a partial transaction is being created.

 public partialTranscation: Transaction = {
    giver: {
      id: '456',
      confirmed: new Date(),
      resources: {
        volunteer: {
          quantity: 1, // "456" no longer has a surplus of "volunteer"
        },
      },
    },
    receiver: {
      id: 'hospital',
    },
  };

  // 4. after notifying the other party (e.g. "hospital") - it confirms and the rest of the details are filled
 public transcation: Transaction = {
    giver: {
      id: '456',
      confirmed: new Date(),
      resources: {
        volunteer: {
          quantity: 1,
        },
      },
    },
    receiver: {
      id: 'hospital',
      confirmed: new Date(),
      resources: {
        volunteer: {
          quantity: 1, // "hospital" deficit drops by the quantity (1)
        },
      },
    },
  };

  // 5. TBD system detected a party with a missing resource and another party with an available one - but in different location
  // 6. finding a "transport" resource that can connect them.

  public connectingTransaction: [Transaction, Transaction] = [
    {
      giver: {
        id: 'hospital',
        confirmed: new Date(),
        resources: {
          'food box': { quantity: 1 },
        },
      },
      receiver: {
        id: '456',
        confirmed: new Date(),
        resources: {
          'food box': { quantity: 1 },
        },
      },
    },
    {
      giver: {
        id: '456',
        confirmed: new Date(),
        resources: {
          'food box': { quantity: 1 },
        },
      },
      receiver: {
        id: 'baryo',
        confirmed: new Date(),
        resources: {
          'food box': { quantity: 1 },
        },
      },
    },
  ];
}

// ±±±±±± types
export type Id = string;
export type ResourceId = string;
export type Organization = ResourceContainer;
export type Person = ResourceContainer;

export interface Metadata {
  name: string;
  desc?: string;
}

export interface ResourceContainer extends Metadata {
  readonly id: Id;
  available?: Record<ResourceId, Resource[]>;
  missing?: Record<ResourceId, Resource[]>;
}

export interface BaseResource extends Partial<Metadata> {
  quantity: number;
}

export type DateCondition = { before?: Date; after?: Date };
export type CustomCondition = { text: string };
export type Condition = DateCondition | CustomCondition;

export interface Resource extends BaseResource {
  category?: string;
  location?: string;
  when?: Condition[];
  target?: string;
}

export interface Transaction {
  giver: {
    id: Id;
    resources?: Record<ResourceId, BaseResource>;
    confirmed?: Date;
  };
  receiver: this['giver'];
}
