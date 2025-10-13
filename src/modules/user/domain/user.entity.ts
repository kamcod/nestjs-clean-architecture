export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public name: string,
        public readonly password: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}

    updateProfile(name: string) {
        this.name = name;
        this.updatedAt = new Date();
    }

    toJSON() {
        const { password, ...rest } = this as any;
        return rest;
    }
}
