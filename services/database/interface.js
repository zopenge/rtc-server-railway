class DatabaseInterface {
    async connect() {
        throw new Error('connect() must be implemented');
    }

    async findOne(table, query = {}) {
        throw new Error('findOne() must be implemented');
    }

    async findMany(table, options = {}) {
        throw new Error('findMany() must be implemented');
    }

    async insert(table, data) {
        throw new Error('insert() must be implemented');
    }

    async update(table, query, updates) {
        throw new Error('update() must be implemented');
    }

    async delete(table, query) {
        throw new Error('delete() must be implemented');
    }

    async shutdown() {
        throw new Error('shutdown() must be implemented');
    }
}

module.exports = DatabaseInterface; 