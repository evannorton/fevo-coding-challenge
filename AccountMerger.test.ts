import { AccountMerger } from "./AccountMerger";

describe('AccountMergerTest', () => {
    test('should merge accounts', () => {
        const accountMerger = new AccountMerger();
        const accounts = [
            {
                "application": 1,
                "emails": ["a@gmail.com", "b@gmail.com"],
                "name": "A"
            },
            {
                "application": 2,
                "emails": ["c@gmail.com", "a@gmail.com"],
                "name": "A"
            },
        ];

        const mergedResult = accountMerger.merge(accounts);
        expect(mergedResult).toEqual([
            {
                applications: [1,2],
                emails: ['a@gmail.com', 'b@gmail.com', 'c@gmail.com'],
                name: 'A'
            }
        ]);
    });

    test('should merge accounts when there are multiple accounts', () => {
        const accountMerger = new AccountMerger();
        const accounts = [
            {
                "application": 1,
                "emails": ["a@gmail.com", "b@gmail.com"],
                "name": "A"
            },
            {
                "application": 2,
                "emails": ["c@gmail.com", "d@gmail.com"],
                "name": "C"
            },
            {
                "application": 2,
                "emails": ["a@yahoo.com", "a@gmail.com"],
                "name": "A"
            },
            {
                "application": 3,
                "emails": ["e@gmail.com", "c@gmail.com"],
                "name": "C"
            }
        ];

        const mergedResult = accountMerger.merge(accounts);
        expect(mergedResult).toEqual([
            {
                applications: [1,2],
                emails: ['a@gmail.com', 'a@yahoo.com', 'b@gmail.com'],
                name: 'A'
            },
            {
                applications: [2,3],
                emails: [ 'c@gmail.com', 'd@gmail.com', 'e@gmail.com'],
                name: 'C'
            }
        ]);
    });

    test('should merge accounts belonging to different people with the same name', () => {
        const accountMerger = new AccountMerger();
        const accounts = [
            {
                "application": 1,
                "emails": ["a@gmail.com", "b@gmail.com"],
                "name": "A"
            },
            {
                "application": 2,
                "emails": ["c@gmail.com", "d@gmail.com"],
                "name": "A"
            },
            {
                "application": 2,
                "emails": ["a@yahoo.com", "a@gmail.com"],
                "name": "A"
            },
            {
                "application": 3,
                "emails": ["e@gmail.com", "c@gmail.com"],
                "name": "A"
            }
        ];

        const mergedResult = accountMerger.merge(accounts);
        expect(mergedResult).toEqual([
            {
                applications: [1,2],
                emails: ['a@gmail.com', 'a@yahoo.com', 'b@gmail.com'],
                name: 'A'
            },
            {
                applications: [2,3],
                emails: [ 'c@gmail.com', 'd@gmail.com', 'e@gmail.com'],
                name: 'A'
            }
        ]);
    });
});