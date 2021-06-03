export default {
    type: 'object',
    properties: {
        id: { type: 'string' },
        availabilityQta: { type: 'number' }
    },
    required: ['id', 'availabilityQta']
} as const;