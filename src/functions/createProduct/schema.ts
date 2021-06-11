export default {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        discount: { type: 'number' },
        availabilityQta: { type: 'number' },
        imagePath: { type: 'string' },
        isSalable: { type: 'boolean' },
        categorieId: { type: 'string' },
        notes: { type: 'string' },
        tags: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        customSpecs: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    fieldName: { type: 'string' },
                    unitMisure: { type: 'string' },
                    value: { type: 'object' }
                },
                required: ['fieldName', 'unitMisure', 'value']
            },

        }

    },
    required: ['title', 'price']
} as const;