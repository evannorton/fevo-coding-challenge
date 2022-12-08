export class AccountMerger {

    // Map each email to owner name
    private owners: Map<String, String>;

    // Map each email to the set of applications it uses
    private apps: Map<String, Set<String>>;

    // Map each email to a parent (initially each email is its own parent/root but we will pick a common parent/root
    // for emails that belong to the same account)
    private parents: Map<String, String>;

    // Map each email root to the set of emails under the same account
    private unions: Map<String, Set<String>>;

    private initialize() {
        this.owners = new Map<String, String>();
        this.apps = new Map<String, Set<String>>();
        this.parents = new Map<String, String>();
        this.unions = new Map<String, Set<String>>();
    }

    public merge(accounts: Account[]) {
        this.initialize();

        // Map each email -> owner in this.owners
        // Map each email -> applications in this.apps
        // Map each email -> itself in this.parents to implement Union Find in the next steps
        for (let account of accounts) {
            for (let email of account.emails) {
                this.owners.set(email, account.name);
                if (!this.apps.has(email)) {
                    this.apps.set(email, new Set<String>());
                }
                this.apps.get(email)?.add(account.application);
                this.parents.set(email, email);
            }
        }

        // For each account, set each email's parent (starting from the second one) to the first email. If the same email appears across 
        // different accounts, we will derive a common root
        for (let account of accounts) {
            const parentEmail = account.emails[0];
            for (let idx = 1; idx < account.emails.length; idx++) {
                this.parents.set(account.emails[idx], parentEmail); 
            }
        }

        // Union the emails that share the same parent/root.
        // Also union the applications that the emails share.
        for (let account of accounts) {
            const parentEmail = this.find(account.emails[0]);
            if (!this.unions.has(parentEmail)) {
                this.unions.set(parentEmail, new Set<String>([parentEmail]));
            }

            for (let idx = 1; idx < account.emails.length; idx++) {
                this.unions.get(parentEmail)?.add(account.emails[idx]);
                let appsAssociatedWithParentEmail: Set<String> = this.apps.get(parentEmail) as Set<String>;
                let appsAssociatedWithEmail: Set<String> = this.apps.get(account.emails[idx]) as Set<String>;
                appsAssociatedWithEmail.forEach(appsAssociatedWithParentEmail.add, appsAssociatedWithParentEmail);
            }
        }

        // Derive the final results
        const results: Person[] = [];
        for (let parent of Array.from(this.unions.keys())) {
            const emails = this.unions.get(parent);
            results.push({
                applications: Array.from(this.apps.get(parent)?.values() as Iterable<String>).sort(),
                emails: Array.from(emails?.values() as Iterable<String>).sort(),
                name: this.owners.get(parent) as String,
            })
        }

        return results;
    }
    
    private find(email: String) {
        return this.parents.get(email) == email ? email : this.find(this.parents.get(email) as String);
    }
}

interface Person {
    applications: String[],
    emails: String[],
    name: String,
}

interface Account {
    application: String,
    emails: String[],
    name: String,
}