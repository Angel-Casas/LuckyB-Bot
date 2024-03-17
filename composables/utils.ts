import { Buffer } from "buffer";
import CryptoJS from 'crypto-js';
import Fingerprint2 from 'fingerprintjs2';

export const generateHash = (data) => {
    const buff = new Buffer(data);
    var hash = CryptoJS.MD5(buff);

    return hash.toString(CryptoJS.enc.Hex);
};

export const generateKey = (data) => {
    const hash = CryptoJS.MD5(data);
    return hash.toString();
}

export const generateFingerprint = (values) => {
    return Fingerprint2.x64hash128(values.join(""), 31);
}

export const showCard = (card) => {
    const typeCard = [
        {
            type: 1,
            icon: "♦",
          },
          {
            type: 2,
            icon: "♥",
          },
          {
            type: 3,
            icon: "♠️",
          },
          {
            type: 4,
            icon: "♣",
          },
    ];

    const cardList = [
        {
          type: 1,
          name: "A",
        },
        {
          type: 2,
          name: "2",
        },
        {
          type: 3,
          name: "3",
        },
        {
          type: 4,
          name: "4",
        },
        {
          type: 5,
          name: "5",
        },
        {
          type: 6,
          name: "6",
        },
        {
          type: 7,
          name: "7",
        },
        {
          type: 8,
          name: "8",
        },
        {
          type: 9,
          name: "9",
        },
        {
          type: 10,
          name: "10",
        },
        {
          type: 11,
          name: "J",
        },
        {
          type: 12,
          name: "Q",
        },
        {
          type: 13,
          name: "K",
        },
      ];

      let n, t;

      cardList.map((item) => {
        if (item.type === card.number) n = item.name;
      });

      typeCard.map((item) => {
        if (item.type === card.type) t = item.icon;
      });

      return `${n} ${t}`;
};

export const splitScript = () => {
    return [
        {
            point: [2, 4],
            action: "P",
          },
          {
            point: [2, 6],
            action: "P",
          },
          {
            point: [2, 8],
            action: "H",
          },
          {
            point: [2, 10],
            action: "D",
          },
          {
            point: [2, 12],
            action: "P",
          },
          {
            point: [2, 14],
            action: "P",
          },
          {
            point: [2, 16],
            action: "P",
          },
          {
            point: [2, 18],
            action: "P",
          },
          {
            point: [2, 20],
            action: "S",
          },
          {
            point: [2, 22],
            action: "P",
          },
          {
            point: [3, 4],
            action: "P",
          },
          {
            point: [3, 6],
            action: "P",
          },
          {
            point: [3, 8],
            action: "H",
          },
          {
            point: [3, 10],
            action: "D",
          },
          {
            point: [3, 12],
            action: "P",
          },
          {
            point: [3, 14],
            action: "P",
          },
          {
            point: [3, 16],
            action: "P",
          },
          {
            point: [3, 18],
            action: "P",
          },
          {
            point: [3, 20],
            action: "S",
          },
          {
            point: [3, 22],
            action: "P",
          },
          {
            point: [4, 4],
            action: "P",
          },
          {
            point: [4, 6],
            action: "P",
          },
          {
            point: [4, 8],
            action: "H",
          },
          {
            point: [4, 10],
            action: "D",
          },
          {
            point: [4, 12],
            action: "P",
          },
          {
            point: [4, 14],
            action: "P",
          },
          {
            point: [4, 16],
            action: "P",
          },
          {
            point: [4, 18],
            action: "P",
          },
          {
            point: [4, 20],
            action: "S",
          },
          {
            point: [4, 22],
            action: "P",
          },
          {
            point: [5, 4],
            action: "P",
          },
          {
            point: [5, 6],
            action: "P",
          },
          {
            point: [5, 8],
            action: "P",
          },
          {
            point: [5, 10],
            action: "D",
          },
          {
            point: [5, 12],
            action: "P",
          },
          {
            point: [5, 14],
            action: "P",
          },
          {
            point: [5, 16],
            action: "P",
          },
          {
            point: [5, 18],
            action: "P",
          },
          {
            point: [5, 20],
            action: "S",
          },
          {
            point: [5, 22],
            action: "P",
          },
          {
            point: [6, 4],
            action: "P",
          },
          {
            point: [6, 6],
            action: "P",
          },
          {
            point: [6, 8],
            action: "P",
          },
          {
            point: [6, 10],
            action: "D",
          },
          {
            point: [6, 12],
            action: "P",
          },
          {
            point: [6, 14],
            action: "P",
          },
          {
            point: [6, 16],
            action: "P",
          },
          {
            point: [6, 18],
            action: "P",
          },
          {
            point: [6, 20],
            action: "S",
          },
          {
            point: [6, 22],
            action: "P",
          },
          {
            point: [7, 4],
            action: "P",
          },
          {
            point: [7, 6],
            action: "P",
          },
          {
            point: [7, 8],
            action: "H",
          },
          {
            point: [7, 10],
            action: "D",
          },
          {
            point: [7, 12],
            action: "H",
          },
          {
            point: [7, 14],
            action: "P",
          },
          {
            point: [7, 16],
            action: "P",
          },
          {
            point: [7, 18],
            action: "S",
          },
          {
            point: [7, 20],
            action: "S",
          },
          {
            point: [7, 22],
            action: "P",
          },
          {
            point: [8, 4],
            action: "H",
          },
          {
            point: [8, 6],
            action: "H",
          },
          {
            point: [8, 8],
            action: "H",
          },
          {
            point: [8, 10],
            action: "D",
          },
          {
            point: [8, 12],
            action: "H",
          },
          {
            point: [8, 14],
            action: "H",
          },
          {
            point: [8, 16],
            action: "P",
          },
          {
            point: [8, 18],
            action: "P",
          },
          {
            point: [8, 20],
            action: "S",
          },
          {
            point: [8, 22],
            action: "P",
          },
          {
            point: [9, 4],
            action: "H",
          },
          {
            point: [9, 6],
            action: "H",
          },
          {
            point: [9, 8],
            action: "H",
          },
          {
            point: [9, 10],
            action: "D",
          },
          {
            point: [9, 12],
            action: "H",
          },
          {
            point: [9, 14],
            action: "H",
          },
          {
            point: [9, 16],
            action: "P",
          },
          {
            point: [9, 18],
            action: "P",
          },
          {
            point: [9, 20],
            action: "S",
          },
          {
            point: [9, 22],
            action: "P",
          },
          {
            point: [10, 4],
            action: "H",
          },
          {
            point: [10, 6],
            action: "H",
          },
          {
            point: [10, 8],
            action: "H",
          },
          {
            point: [10, 10],
            action: "H",
          },
          {
            point: [10, 12],
            action: "H",
          },
          {
            point: [10, 14],
            action: "H",
          },
          {
            point: [10, 16],
            action: "P",
          },
          {
            point: [10, 18],
            action: "S",
          },
          {
            point: [10, 20],
            action: "S",
          },
          {
            point: [10, 22],
            action: "P",
          },
          {
            point: [11, 4],
            action: "H",
          },
          {
            point: [11, 6],
            action: "H",
          },
          {
            point: [11, 8],
            action: "H",
          },
          {
            point: [11, 10],
            action: "H",
          },
          {
            point: [11, 12],
            action: "H",
          },
          {
            point: [11, 14],
            action: "H",
          },
          {
            point: [11, 16],
            action: "P",
          },
          {
            point: [11, 18],
            action: "S",
          },
          {
            point: [11, 20],
            action: "S",
          },
          {
            point: [11, 22],
            action: "P",
          },
    ];
};

export const softScript = () => {
    return [
        {
        point: [2, 13],
        action: "H",
        },
        {
        point: [2, 14],
        action: "H",
        },
        {
        point: [2, 15],
        action: "H",
        },
        {
        point: [2, 16],
        action: "H",
        },
        {
        point: [2, 17],
        action: "H",
        },
        {
        point: [2, 18],
        action: "S",
        },
        {
        point: [2, 19],
        action: "S",
        },
        {
        point: [2, 20],
        action: "S",
        },
        {
        point: [2, 21],
        action: "S",
        },
        {
        point: [3, 13],
        action: "H",
        },
        {
        point: [3, 14],
        action: "H",
        },
        {
        point: [3, 15],
        action: "H",
        },
        {
        point: [3, 16],
        action: "H",
        },
        {
        point: [3, 17],
        action: "D",
        },
        {
        point: [3, 18],
        action: "D",
        },
        {
        point: [3, 19],
        action: "S",
        },
        {
        point: [3, 20],
        action: "S",
        },
        {
        point: [3, 21],
        action: "S",
        },
        {
        point: [4, 13],
        action: "S",
        },
        {
        point: [4, 14],
        action: "S",
        },
        {
        point: [4, 15],
        action: "S",
        },
        {
        point: [4, 16],
        action: "D",
        },
        {
        point: [4, 17],
        action: "D",
        },
        {
        point: [4, 18],
        action: "D",
        },
        {
        point: [4, 19],
        action: "S",
        },
        {
        point: [4, 20],
        action: "S",
        },
        {
        point: [4, 21],
        action: "S",
        },
        {
        point: [5, 13],
        action: "H",
        },
        {
        point: [5, 14],
        action: "D",
        },
        {
        point: [5, 15],
        action: "D",
        },
        {
        point: [5, 16],
        action: "D",
        },
        {
        point: [5, 17],
        action: "D",
        },
        {
        point: [5, 18],
        action: "D",
        },
        {
        point: [5, 19],
        action: "S",
        },
        {
        point: [5, 20],
        action: "S",
        },
        {
        point: [5, 21],
        action: "S",
        },
        {
        point: [6, 13],
        action: "D",
        },
        {
        point: [6, 14],
        action: "D",
        },
        {
        point: [6, 15],
        action: "D",
        },
        {
        point: [6, 16],
        action: "D",
        },
        {
        point: [6, 17],
        action: "D",
        },
        {
        point: [6, 18],
        action: "D",
        },
        {
        point: [6, 19],
        action: "S",
        },
        {
        point: [6, 20],
        action: "S",
        },
        {
        point: [6, 21],
        action: "S",
        },
        {
        point: [7, 13],
        action: "H",
        },
        {
        point: [7, 14],
        action: "H",
        },
        {
        point: [7, 15],
        action: "H",
        },
        {
        point: [7, 16],
        action: "H",
        },
        {
        point: [7, 17],
        action: "H",
        },
        {
        point: [7, 18],
        action: "S",
        },
        {
        point: [7, 19],
        action: "S",
        },
        {
        point: [7, 20],
        action: "S",
        },
        {
        point: [7, 21],
        action: "S",
        },
        {
        point: [8, 13],
        action: "H",
        },
        {
        point: [8, 14],
        action: "H",
        },
        {
        point: [8, 15],
        action: "H",
        },
        {
        point: [8, 16],
        action: "H",
        },
        {
        point: [8, 17],
        action: "H",
        },
        {
        point: [8, 18],
        action: "S",
        },
        {
        point: [8, 19],
        action: "S",
        },
        {
        point: [8, 20],
        action: "S",
        },
        {
        point: [8, 21],
        action: "S",
        },
        {
        point: [9, 13],
        action: "H",
        },
        {
        point: [9, 14],
        action: "H",
        },
        {
        point: [9, 15],
        action: "H",
        },
        {
        point: [9, 16],
        action: "H",
        },
        {
        point: [9, 17],
        action: "H",
        },
        {
        point: [9, 18],
        action: "H",
        },
        {
        point: [9, 19],
        action: "S",
        },
        {
        point: [9, 20],
        action: "S",
        },
        {
        point: [9, 21],
        action: "S",
        },
        {
        point: [10, 13],
        action: "H",
        },
        {
        point: [10, 14],
        action: "H",
        },
        {
        point: [10, 15],
        action: "H",
        },
        {
        point: [10, 16],
        action: "H",
        },
        {
        point: [10, 17],
        action: "H",
        },
        {
        point: [10, 18],
        action: "H",
        },
        {
        point: [10, 19],
        action: "S",
        },
        {
        point: [10, 20],
        action: "S",
        },
        {
        point: [10, 21],
        action: "S",
        },
        {
        point: [11, 13],
        action: "H",
        },
        {
        point: [11, 14],
        action: "H",
        },
        {
        point: [11, 15],
        action: "H",
        },
        {
        point: [11, 16],
        action: "H",
        },
        {
        point: [11, 17],
        action: "H",
        },
        {
        point: [11, 18],
        action: "H",
        },
        {
        point: [11, 19],
        action: "S",
        },
        {
        point: [11, 20],
        action: "S",
        },
        {
        point: [11, 21],
        action: "S",
        },
    ]
};

export const hardScript = () => {
    return [
        {
            point: [2, 4],
            action: "H",
          },
          {
            point: [2, 5],
            action: "H",
          },
          {
            point: [2, 6],
            action: "H",
          },
          {
            point: [2, 7],
            action: "H",
          },
          {
            point: [2, 8],
            action: "H",
          },
          {
            point: [2, 9],
            action: "H",
          },
          {
            point: [2, 10],
            action: "D",
          },
          {
            point: [2, 11],
            action: "D",
          },
          {
            point: [2, 12],
            action: "H",
          },
          {
            point: [2, 13],
            action: "S",
          },
          {
            point: [2, 14],
            action: "S",
          },
          {
            point: [2, 15],
            action: "S",
          },
          {
            point: [2, 16],
            action: "S",
          },
          {
            point: [2, 17],
            action: "S",
          },
          {
            point: [2, 18],
            action: "S",
          },
          {
            point: [2, 19],
            action: "S",
          },
          {
            point: [2, 20],
            action: "S",
          },
          {
            point: [2, 21],
            action: "S",
          },
          {
            point: [3, 4],
            action: "H",
          },
          {
            point: [3, 5],
            action: "H",
          },
          {
            point: [3, 6],
            action: "H",
          },
          {
            point: [3, 7],
            action: "H",
          },
          {
            point: [3, 8],
            action: "H",
          },
          {
            point: [3, 9],
            action: "D",
          },
          {
            point: [3, 10],
            action: "D",
          },
          {
            point: [3, 11],
            action: "D",
          },
          {
            point: [3, 12],
            action: "H",
          },
          {
            point: [3, 13],
            action: "S",
          },
          {
            point: [3, 14],
            action: "S",
          },
          {
            point: [3, 15],
            action: "S",
          },
          {
            point: [3, 16],
            action: "S",
          },
          {
            point: [3, 17],
            action: "S",
          },
          {
            point: [3, 18],
            action: "S",
          },
          {
            point: [3, 19],
            action: "S",
          },
          {
            point: [3, 20],
            action: "S",
          },
          {
            point: [3, 21],
            action: "S",
          },
          {
            point: [4, 4],
            action: "H",
          },
          {
            point: [4, 5],
            action: "H",
          },
          {
            point: [4, 6],
            action: "H",
          },
          {
            point: [4, 7],
            action: "H",
          },
          {
            point: [4, 8],
            action: "H",
          },
          {
            point: [4, 9],
            action: "D",
          },
          {
            point: [4, 10],
            action: "D",
          },
          {
            point: [4, 11],
            action: "D",
          },
          {
            point: [4, 12],
            action: "S",
          },
          {
            point: [4, 13],
            action: "S",
          },
          {
            point: [4, 14],
            action: "S",
          },
          {
            point: [4, 15],
            action: "S",
          },
          {
            point: [4, 16],
            action: "S",
          },
          {
            point: [4, 17],
            action: "S",
          },
          {
            point: [4, 18],
            action: "S",
          },
          {
            point: [4, 19],
            action: "S",
          },
          {
            point: [4, 20],
            action: "S",
          },
          {
            point: [4, 21],
            action: "S",
          },
          {
            point: [5, 4],
            action: "H",
          },
          {
            point: [5, 5],
            action: "H",
          },
          {
            point: [5, 6],
            action: "H",
          },
          {
            point: [5, 7],
            action: "H",
          },
          {
            point: [5, 8],
            action: "H",
          },
          {
            point: [5, 9],
            action: "D",
          },
          {
            point: [5, 10],
            action: "D",
          },
          {
            point: [5, 11],
            action: "D",
          },
          {
            point: [5, 12],
            action: "S",
          },
          {
            point: [5, 13],
            action: "S",
          },
          {
            point: [5, 14],
            action: "S",
          },
          {
            point: [5, 15],
            action: "S",
          },
          {
            point: [5, 16],
            action: "S",
          },
          {
            point: [5, 17],
            action: "S",
          },
          {
            point: [5, 18],
            action: "S",
          },
          {
            point: [5, 19],
            action: "S",
          },
          {
            point: [5, 20],
            action: "S",
          },
          {
            point: [5, 21],
            action: "S",
          },
          {
            point: [6, 4],
            action: "H",
          },
          {
            point: [6, 5],
            action: "H",
          },
          {
            point: [6, 6],
            action: "H",
          },
          {
            point: [6, 7],
            action: "H",
          },
          {
            point: [6, 8],
            action: "H",
          },
          {
            point: [6, 9],
            action: "D",
          },
          {
            point: [6, 10],
            action: "D",
          },
          {
            point: [6, 11],
            action: "D",
          },
          {
            point: [6, 12],
            action: "S",
          },
          {
            point: [6, 13],
            action: "S",
          },
          {
            point: [6, 14],
            action: "S",
          },
          {
            point: [6, 15],
            action: "S",
          },
          {
            point: [6, 16],
            action: "S",
          },
          {
            point: [6, 17],
            action: "S",
          },
          {
            point: [6, 18],
            action: "S",
          },
          {
            point: [6, 19],
            action: "S",
          },
          {
            point: [6, 20],
            action: "S",
          },
          {
            point: [6, 21],
            action: "S",
          },
          {
            point: [7, 4],
            action: "H",
          },
          {
            point: [7, 5],
            action: "H",
          },
          {
            point: [7, 6],
            action: "H",
          },
          {
            point: [7, 7],
            action: "H",
          },
          {
            point: [7, 8],
            action: "H",
          },
          {
            point: [7, 9],
            action: "H",
          },
          {
            point: [7, 10],
            action: "D",
          },
          {
            point: [7, 11],
            action: "D",
          },
          {
            point: [7, 12],
            action: "H",
          },
          {
            point: [7, 13],
            action: "H",
          },
          {
            point: [7, 14],
            action: "H",
          },
          {
            point: [7, 15],
            action: "H",
          },
          {
            point: [7, 16],
            action: "H",
          },
          {
            point: [7, 17],
            action: "S",
          },
          {
            point: [7, 18],
            action: "S",
          },
          {
            point: [7, 19],
            action: "S",
          },
          {
            point: [7, 20],
            action: "S",
          },
          {
            point: [7, 21],
            action: "S",
          },
          {
            point: [8, 4],
            action: "H",
          },
          {
            point: [8, 5],
            action: "H",
          },
          {
            point: [8, 6],
            action: "H",
          },
          {
            point: [8, 7],
            action: "H",
          },
          {
            point: [8, 8],
            action: "H",
          },
          {
            point: [8, 9],
            action: "H",
          },
          {
            point: [8, 10],
            action: "D",
          },
          {
            point: [8, 11],
            action: "D",
          },
          {
            point: [8, 12],
            action: "H",
          },
          {
            point: [8, 13],
            action: "H",
          },
          {
            point: [8, 14],
            action: "H",
          },
          {
            point: [8, 15],
            action: "H",
          },
          {
            point: [8, 16],
            action: "H",
          },
          {
            point: [8, 17],
            action: "S",
          },
          {
            point: [8, 18],
            action: "S",
          },
          {
            point: [8, 19],
            action: "S",
          },
          {
            point: [8, 20],
            action: "S",
          },
          {
            point: [8, 21],
            action: "S",
          },
          {
            point: [9, 4],
            action: "H",
          },
          {
            point: [9, 5],
            action: "H",
          },
          {
            point: [9, 6],
            action: "H",
          },
          {
            point: [9, 7],
            action: "H",
          },
          {
            point: [9, 8],
            action: "H",
          },
          {
            point: [9, 9],
            action: "H",
          },
          {
            point: [9, 10],
            action: "D",
          },
          {
            point: [9, 11],
            action: "D",
          },
          {
            point: [9, 12],
            action: "H",
          },
          {
            point: [9, 13],
            action: "H",
          },
          {
            point: [9, 14],
            action: "H",
          },
          {
            point: [9, 15],
            action: "H",
          },
          {
            point: [9, 16],
            action: "H",
          },
          {
            point: [9, 17],
            action: "S",
          },
          {
            point: [9, 18],
            action: "S",
          },
          {
            point: [9, 19],
            action: "S",
          },
          {
            point: [9, 20],
            action: "S",
          },
          {
            point: [9, 21],
            action: "S",
          },
          {
            point: [10, 4],
            action: "H",
          },
          {
            point: [10, 5],
            action: "H",
          },
          {
            point: [10, 6],
            action: "H",
          },
          {
            point: [10, 7],
            action: "H",
          },
          {
            point: [10, 8],
            action: "H",
          },
          {
            point: [10, 9],
            action: "H",
          },
          {
            point: [10, 10],
            action: "H",
          },
          {
            point: [10, 11],
            action: "D",
          },
          {
            point: [10, 12],
            action: "H",
          },
          {
            point: [10, 13],
            action: "H",
          },
          {
            point: [10, 14],
            action: "H",
          },
          {
            point: [10, 15],
            action: "H",
          },
          {
            point: [10, 16],
            action: "H",
          },
          {
            point: [10, 17],
            action: "S",
          },
          {
            point: [10, 18],
            action: "S",
          },
          {
            point: [10, 19],
            action: "S",
          },
          {
            point: [10, 20],
            action: "S",
          },
          {
            point: [10, 21],
            action: "S",
          },
          {
            point: [11, 4],
            action: "H",
          },
          {
            point: [11, 5],
            action: "H",
          },
          {
            point: [11, 6],
            action: "H",
          },
          {
            point: [11, 7],
            action: "H",
          },
          {
            point: [11, 8],
            action: "H",
          },
          {
            point: [11, 9],
            action: "H",
          },
          {
            point: [11, 10],
            action: "H",
          },
          {
            point: [11, 11],
            action: "H",
          },
          {
            point: [11, 12],
            action: "H",
          },
          {
            point: [11, 13],
            action: "H",
          },
          {
            point: [11, 14],
            action: "H",
          },
          {
            point: [11, 15],
            action: "H",
          },
          {
            point: [11, 16],
            action: "H",
          },
          {
            point: [11, 17],
            action: "S",
          },
          {
            point: [11, 18],
            action: "S",
          },
          {
            point: [11, 19],
            action: "S",
          },
          {
            point: [11, 20],
            action: "S",
          },
          {
            point: [11, 21],
            action: "S",
          },
    ]
};