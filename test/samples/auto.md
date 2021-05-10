

## Model: child
* id: bigint
* name: string
* createdAt: date
* updatedAt: date
* *parentId*: bigint
* grandchildren: [grandchild[]](#model-grandchild).



## Example of  child
```
    {
      "id": 1,
      "name": "string",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "parentId": 1,
      "grandchildren": [
        {
          "id": 1,
          "name": "string",
          "createdAt": "2015-12-31T23:59:59.123",
          "updatedAt": "2015-12-31T23:59:59.123",
          "parentId": 1,
          "grandParentId": 1,
          "childId": 1,
          "parent": {
            "id": 1,
            "uuid": "413e8630-c16c-11e5-b8c9-9b7d37852114",
            "name": "string",
            "count": 1,
            "category": "CAT1 | CAT2",
            "birthday": "2015-12-31T23:59:59.123",
            "createdAt": "2015-12-31T23:59:59.123",
            "updatedAt": "2015-12-31T23:59:59.123",
            "parentDetailsId": 1,
            "children": [
              {}
            ],
            "parentDetail": {
              "id": 1,
              "address": "string",
              "createdAt": "2015-12-31T23:59:59.123",
              "updatedAt": "2015-12-31T23:59:59.123",
              "parentId": 1
            }
          }
        }
      ]
    }
```



## Model: grandchild
* id: bigint
* name: string
* createdAt: date
* updatedAt: date
* *parentId*: bigint
* *grandParentId*: bigint
* *childId*: bigint
* parent: [parent](#model-parent).



## Example of  grandchild
```
    {
      "id": 1,
      "name": "string",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "parentId": 1,
      "grandParentId": 1,
      "childId": 1,
      "parent": {
        "id": 1,
        "uuid": "413e8630-c16c-11e5-b8c9-9b7d37852114",
        "name": "string",
        "count": 1,
        "category": "CAT1 | CAT2",
        "birthday": "2015-12-31T23:59:59.123",
        "createdAt": "2015-12-31T23:59:59.123",
        "updatedAt": "2015-12-31T23:59:59.123",
        "parentDetailsId": 1,
        "children": [
          {
            "id": 1,
            "name": "string",
            "createdAt": "2015-12-31T23:59:59.123",
            "updatedAt": "2015-12-31T23:59:59.123",
            "parentId": 1,
            "grandchildren": [
              {}
            ]
          }
        ],
        "parentDetail": {
          "id": 1,
          "address": "string",
          "createdAt": "2015-12-31T23:59:59.123",
          "updatedAt": "2015-12-31T23:59:59.123",
          "parentId": 1
        }
      }
    }
```



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



## Example of  parent
```
    {
      "id": 1,
      "uuid": "413e8630-c16c-11e5-b8c9-9b7d37852114",
      "name": "string",
      "count": 1,
      "category": "CAT1 | CAT2",
      "birthday": "2015-12-31T23:59:59.123",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "parentDetailsId": 1,
      "children": [
        {
          "id": 1,
          "name": "string",
          "createdAt": "2015-12-31T23:59:59.123",
          "updatedAt": "2015-12-31T23:59:59.123",
          "parentId": 1,
          "grandchildren": [
            {
              "id": 1,
              "name": "string",
              "createdAt": "2015-12-31T23:59:59.123",
              "updatedAt": "2015-12-31T23:59:59.123",
              "parentId": 1,
              "grandParentId": 1,
              "childId": 1,
              "parent": {}
            }
          ]
        }
      ],
      "parentDetail": {
        "id": 1,
        "address": "string",
        "createdAt": "2015-12-31T23:59:59.123",
        "updatedAt": "2015-12-31T23:59:59.123",
        "parentId": 1
      }
    }
```



## Model: parentDetails
* id: bigint
* address: string
* createdAt: date
* updatedAt: date
* *parentId*: bigint



## Example of  parentDetails
```
    {
      "id": 1,
      "address": "string",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "parentId": 1
    }
```

