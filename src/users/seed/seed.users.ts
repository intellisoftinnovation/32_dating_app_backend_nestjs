import { ItPrivileges } from "src/auth/interfaces/ItPrivileges"
import { AccountStatus, UserRole } from "../schemas/meta-data.schema"
import { User } from "../schemas/user.schema"
import { Appearance, BodyType, EnglishLevel, Etnicidad, FamilySituation, Gender, Language, TypeOfRelationFind } from "../schemas/profile.schema"
import { Currency } from "../schemas/profit.schema"
import { SocialNetworks } from "../schemas/social-network.schema"
import { getRandomBirthdate, getRandomBoolean, getRandomCreatedAt, getRandomEnumValue, getRandomPhoneNumber } from "./tools/seed.tools"


export type SeedUser = Partial<User>
const seedUsers: SeedUser =
{
    name: `Chamoy ${Math.random().toString(36).substring(7)}`,
    email: `${Math.random().toString(36).substring(7).toLocaleLowerCase()}@gmail.com`,
    password: 'X2Zr3EI4R5P6M7saA',
    metaData: {
        accountStatus: AccountStatus.ACTIVE,
        userRole: UserRole.USER,
        privileges: [ItPrivileges.DEFAULT],
        isAdmin: false,
        createdAt: getRandomCreatedAt(),
        lastConnection: new Date()
    },
    profile: {
        altura: 180,
        appearance: getRandomEnumValue(Appearance),
        birthdate: getRandomBirthdate(18, 55),
        bodyType: getRandomEnumValue(BodyType),
        description: `${Math.random().toString(36).substring(30).toLocaleLowerCase()}`,
        englishLevel: getRandomEnumValue(EnglishLevel),
        etnicidad: getRandomEnumValue(Etnicidad),
        familySituation: getRandomEnumValue(FamilySituation),
        gender: getRandomEnumValue(Gender),
        typeOfRelationFind: getRandomEnumValue(TypeOfRelationFind),
        language: getRandomEnumValue(Language),
        phone: getRandomPhoneNumber('+51'),
        request: Math.floor(Math.random() * 1000) + 1,
        genderVerified: false,
        geoLocations: {
            latitude: 0,
            longitude: 0,
            city: 'City Example',
            country: 'Country Example',
        },
        phoneVerified: false,
        onBoardingCompleted: true,
        photos: [
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
        ],
        polityAgreement: true,
        profit: {
            min: 0,
            max: 0,
            currency: Currency.SOL
        },
        smoking: getRandomBoolean(),
        socialNetworks: [
            {
                socialNetwork: SocialNetworks.INSTAGRAM,
                username: "Instagram UserName"
            },
            {
                socialNetwork: SocialNetworks.FACEBOOK,
                username: "Facebook Username"
            },
        ]
    },
    // Preferences whs comented on girls profiles ... 
    // preference: {
    //     ageRange: {
    //         min: 25 , 
    //         max: 38
    //     }, 
    //     altura: {
    //         min: 170, 
    //         max: 200
    //     }, 
    //     appearance: [Appearance.AVERAGE],
    //     bodyType: [BodyType.AVERAGE],
    //     distance: 15,
    //     englishLevel: [EnglishLevel.MEDIO],
    //     etnicidad:[Etnicidad.LATINO],
    //     familySituation:[FamilySituation.ONE_CHILD],
    //     language: [Language.SPANISH],
    //     smoking: [true]
    // }
}

export const getRandomUsers = (count: number): SeedUser[] => {
    const users: SeedUser[] = []
    for (let i = 0; i < count; i++) {
        const user = {
            ...seedUsers,
            name: `Chamoy ${Math.random().toString(36).substring(7)}`,
            email: `${Math.random().toString(36).substring(7).toLowerCase()}@gmail.com`,
            profile: {
                ...seedUsers.profile,
                appearance: getRandomEnumValue(Appearance),
                birthdate: getRandomBirthdate(18, 55),
                bodyType: getRandomEnumValue(BodyType),
                description: `${Math.random().toString(36).substring(30).toLocaleLowerCase()}`,
                englishLevel: getRandomEnumValue(EnglishLevel),
                etnicidad: getRandomEnumValue(Etnicidad),
                familySituation: getRandomEnumValue(FamilySituation),
                gender: getRandomEnumValue(Gender),
                language: getRandomEnumValue(Language),
                phone: getRandomPhoneNumber('+51'),
                request: Math.floor(Math.random() * 1000) + 1,
                altura: Math.floor(Math.random() * (200 - 140 + 1)) + 140,
                smoking: getRandomBoolean(),
                typeOfRelationFind: getRandomEnumValue(TypeOfRelationFind),
            },
            metaData:{
                ...seedUsers.metaData,
                createdAt: getRandomCreatedAt(),
            }
            
        };
        users.push(user);
    }
    return users;
}
