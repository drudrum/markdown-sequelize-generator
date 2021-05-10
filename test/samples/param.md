

## Model: parent
* id: bigint
* uuid: uuid
* name: string
* *count*: integer
* category: enum
* birthday: date
* createdAt: date
* updatedAt: date
* *parentDetailsId*: bigint
* [parentDetail]: [parentDetails](#model-parentDetails).
* children: [child[]](#model-child).
