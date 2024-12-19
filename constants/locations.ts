// constants/locations.ts

export const UK_REGIONS = {
  'East Midlands': {
    counties: [
      'Derbyshire',
      'Leicestershire',
      'Lincolnshire',
      'Northamptonshire',
      'Nottinghamshire',
      'Rutland'
    ],
    towns: {
      Derbyshire: [
        'Derby',
        'Chesterfield',
        'Swadlincote',
        'Buxton',
        'Glossop',
        'Ilkeston',
        'Long Eaton',
        'Matlock'
      ],
      Leicestershire: [
        'Leicester',
        'Loughborough',
        'Hinckley',
        'Coalville',
        'Melton Mowbray',
        'Market Harborough',
        'Wigston',
        'Ashby-de-la-Zouch'
      ],
      Lincolnshire: [
        'Lincoln',
        'Boston',
        'Grantham',
        'Grimsby',
        'Scunthorpe',
        'Skegness',
        'Spalding',
        'Stamford'
      ],
      Northamptonshire: [
        'Northampton',
        'Kettering',
        'Corby',
        'Wellingborough',
        'Rushden',
        'Daventry',
        'Brackley'
      ],
      Nottinghamshire: [
        'Nottingham',
        'Mansfield',
        'Worksop',
        'Newark-on-Trent',
        'Sutton-in-Ashfield',
        'Retford',
        'Beeston'
      ],
      Rutland: ['Oakham', 'Uppingham']
    }
  },
  'East of England': {
    counties: [
      'Bedfordshire',
      'Cambridgeshire',
      'Essex',
      'Hertfordshire',
      'Norfolk',
      'Suffolk'
    ],
    towns: {
      Bedfordshire: [
        'Bedford',
        'Luton',
        'Dunstable',
        'Leighton Buzzard',
        'Biggleswade',
        'Sandy',
        'Flitwick'
      ],
      Cambridgeshire: [
        'Cambridge',
        'Peterborough',
        'Wisbech',
        'March',
        'St Neots',
        'Huntingdon',
        'Ely',
        'St Ives'
      ],
      Essex: [
        'Chelmsford',
        'Southend-on-Sea',
        'Colchester',
        'Basildon',
        'Harlow',
        'Brentwood',
        'Clacton-on-Sea',
        'Braintree',
        'Witham',
        'Maldon',
        'Wickford',
        'Loughton'
      ],
      Hertfordshire: [
        'St Albans',
        'Watford',
        'Hemel Hempstead',
        'Stevenage',
        'Welwyn Garden City',
        'Hatfield',
        'Bishops Stortford',
        'Hitchin',
        'Hertford',
        'Hoddesdon',
        'Cheshunt',
        'Borehamwood'
      ],
      Norfolk: [
        'Norwich',
        'Great Yarmouth',
        'Kings Lynn',
        'Thetford',
        'Dereham',
        'Wymondham',
        'North Walsham',
        'Cromer'
      ],
      Suffolk: [
        'Ipswich',
        'Bury St Edmunds',
        'Lowestoft',
        'Haverhill',
        'Felixstowe',
        'Sudbury',
        'Stowmarket',
        'Newmarket'
      ]
    }
  },
  'Greater London': {
    counties: ['Greater London'],
    towns: {
      'Greater London': [
        'City of London',
        'Barking and Dagenham',
        'Barnet',
        'Bexley',
        'Brent',
        'Bromley',
        'Camden',
        'Croydon',
        'Ealing',
        'Enfield',
        'Greenwich',
        'Hackney',
        'Hammersmith and Fulham',
        'Haringey',
        'Harrow',
        'Havering',
        'Hillingdon',
        'Hounslow',
        'Islington',
        'Kensington and Chelsea',
        'Kingston upon Thames',
        'Lambeth',
        'Lewisham',
        'Merton',
        'Newham',
        'Redbridge',
        'Richmond upon Thames',
        'Southwark',
        'Sutton',
        'Tower Hamlets',
        'Waltham Forest',
        'Wandsworth',
        'Westminster'
      ]
    }
  },
  'North East': {
    counties: ['County Durham', 'Northumberland', 'Tyne and Wear'],
    towns: {
      'County Durham': [
        'Durham',
        'Darlington',
        'Hartlepool',
        'Stockton-on-Tees',
        'Bishop Auckland',
        'Chester-le-Street',
        'Consett',
        'Newton Aycliffe',
        'Peterlee',
        'Seaham'
      ],
      Northumberland: [
        'Alnwick',
        'Ashington',
        'Berwick-upon-Tweed',
        'Blyth',
        'Cramlington',
        'Hexham',
        'Morpeth',
        'Prudhoe'
      ],
      'Tyne and Wear': [
        'Newcastle upon Tyne',
        'Sunderland',
        'Gateshead',
        'South Shields',
        'North Shields',
        'Whitley Bay',
        'Wallsend',
        'Jarrow'
      ]
    }
  },
  'North West': {
    counties: [
      'Cheshire',
      'Cumbria',
      'Greater Manchester',
      'Lancashire',
      'Merseyside'
    ],
    towns: {
      Cheshire: [
        'Chester',
        'Crewe',
        'Macclesfield',
        'Warrington',
        'Ellesmere Port',
        'Wilmslow',
        'Northwich',
        'Winsford',
        'Nantwich',
        'Sandbach'
      ],
      Cumbria: [
        'Carlisle',
        'Barrow-in-Furness',
        'Kendal',
        'Whitehaven',
        'Workington',
        'Penrith',
        'Ulverston',
        'Maryport',
        'Windermere'
      ],
      'Greater Manchester': [
        'Manchester',
        'Bolton',
        'Bury',
        'Oldham',
        'Rochdale',
        'Salford',
        'Stockport',
        'Tameside',
        'Trafford',
        'Wigan'
      ],
      Lancashire: [
        'Lancaster',
        'Blackpool',
        'Preston',
        'Blackburn',
        'Burnley',
        'Chorley',
        'Lytham St Annes',
        'Morecambe',
        'Nelson',
        'Colne'
      ],
      Merseyside: [
        'Liverpool',
        'Birkenhead',
        'Bootle',
        'Kirkby',
        'Southport',
        'St Helens',
        'Wallasey',
        'Huyton'
      ]
    }
  },
  'South East': {
    counties: [
      'Berkshire',
      'Buckinghamshire',
      'East Sussex',
      'Hampshire',
      'Isle of Wight',
      'Kent',
      'Oxfordshire',
      'Surrey',
      'West Sussex'
    ],
    towns: {
      Berkshire: [
        'Reading',
        'Slough',
        'Bracknell',
        'Maidenhead',
        'Newbury',
        'Windsor',
        'Wokingham',
        'Woodley'
      ],
      Buckinghamshire: [
        'Aylesbury',
        'High Wycombe',
        'Milton Keynes',
        'Amersham',
        'Chesham',
        'Marlow',
        'Beaconsfield'
      ],
      'East Sussex': [
        'Brighton',
        'Eastbourne',
        'Hastings',
        'Hove',
        'Lewes',
        'Bexhill-on-Sea',
        'Crowborough',
        'Seaford'
      ],
      Hampshire: [
        'Southampton',
        'Portsmouth',
        'Winchester',
        'Basingstoke',
        'Eastleigh',
        'Fareham',
        'Gosport',
        'Andover',
        'Aldershot',
        'Farnborough'
      ],
      'Isle of Wight': [
        'Newport',
        'Ryde',
        'Cowes',
        'Sandown',
        'Shanklin',
        'Ventnor'
      ],
      Kent: [
        'Maidstone',
        'Canterbury',
        'Dover',
        'Folkestone',
        'Margate',
        'Ramsgate',
        'Rochester',
        'Tunbridge Wells',
        'Ashford',
        'Dartford',
        'Gillingham',
        'Gravesend',
        'Royal Tunbridge Wells',
        'Sevenoaks',
        'Sittingbourne',
        'Tonbridge',
        'Whitstable'
      ],
      Oxfordshire: [
        'Oxford',
        'Banbury',
        'Bicester',
        'Witney',
        'Didcot',
        'Abingdon',
        'Carterton',
        'Henley-on-Thames'
      ],
      Surrey: [
        'Guildford',
        'Woking',
        'Croydon',
        'Epsom',
        'Redhill',
        'Reigate',
        'Staines',
        'Sutton',
        'Kingston upon Thames',
        'Richmond',
        'Farnham',
        'Leatherhead'
      ],
      'West Sussex': [
        'Chichester',
        'Worthing',
        'Crawley',
        'Horsham',
        'Bognor Regis',
        'Littlehampton',
        'East Grinstead',
        'Haywards Heath',
        'Shoreham-by-Sea'
      ]
    }
  },
  'South West': {
    counties: [
      'Bristol',
      'Cornwall',
      'Devon',
      'Dorset',
      'Gloucestershire',
      'Somerset',
      'Wiltshire'
    ],
    towns: {
      Bristol: [
        'Bristol',
        'Bath',
        'Weston-super-Mare',
        'Clevedon',
        'Portishead',
        'Nailsea'
      ],
      Cornwall: [
        'Truro',
        'Falmouth',
        'Newquay',
        'Penzance',
        'St Austell',
        'Camborne',
        'Redruth',
        'St Ives',
        'Bodmin',
        'Liskeard'
      ],
      Devon: [
        'Exeter',
        'Plymouth',
        'Torquay',
        'Paignton',
        'Barnstaple',
        'Exmouth',
        'Newton Abbot',
        'Tiverton',
        'Bideford',
        'Sidmouth'
      ],
      Dorset: [
        'Bournemouth',
        'Poole',
        'Weymouth',
        'Dorchester',
        'Bridport',
        'Sherborne',
        'Wimborne Minster',
        'Swanage'
      ],
      Gloucestershire: [
        'Gloucester',
        'Cheltenham',
        'Stroud',
        'Cirencester',
        'Tewkesbury',
        'Dursley',
        'Stow-on-the-Wold'
      ],
      Somerset: [
        'Taunton',
        'Bath',
        'Yeovil',
        'Bridgwater',
        'Frome',
        'Glastonbury',
        'Wells',
        'Minehead',
        'Street',
        'Shepton Mallet'
      ],
      Wiltshire: [
        'Swindon',
        'Salisbury',
        'Chippenham',
        'Trowbridge',
        'Warminster',
        'Melksham',
        'Devizes',
        'Marlborough'
      ]
    }
  },
  'West Midlands': {
    counties: [
      'Herefordshire',
      'Shropshire',
      'Staffordshire',
      'Warwickshire',
      'West Midlands',
      'Worcestershire'
    ],
    towns: {
      Herefordshire: [
        'Hereford',
        'Leominster',
        'Ross-on-Wye',
        'Ledbury',
        'Bromyard',
        'Kington'
      ],
      Shropshire: [
        'Shrewsbury',
        'Telford',
        'Oswestry',
        'Bridgnorth',
        'Market Drayton',
        'Ludlow',
        'Wellington',
        'Whitchurch'
      ],
      Staffordshire: [
        'Stoke-on-Trent',
        'Stafford',
        'Burton upon Trent',
        'Cannock',
        'Lichfield',
        'Newcastle-under-Lyme',
        'Tamworth',
        'Uttoxeter'
      ],
      Warwickshire: [
        'Warwick',
        'Rugby',
        'Nuneaton',
        'Leamington Spa',
        'Stratford-upon-Avon',
        'Bedworth',
        'Kenilworth',
        'Atherstone'
      ],
      'West Midlands': [
        'Birmingham',
        'Coventry',
        'Dudley',
        'Solihull',
        'Walsall',
        'West Bromwich',
        'Wolverhampton',
        'Stourbridge'
      ],
      Worcestershire: [
        'Worcester',
        'Redditch',
        'Bromsgrove',
        'Kidderminster',
        'Malvern',
        'Evesham',
        'Droitwich Spa',
        'Stourport-on-Severn'
      ]
    }
  },
  'Yorkshire and the Humber': {
    counties: [
      'East Riding of Yorkshire',
      'North Yorkshire',
      'South Yorkshire',
      'West Yorkshire'
    ],
    towns: {
      'East Riding of Yorkshire': [
        'Hull',
        'Beverley',
        'Bridlington',
        'Goole',
        'Driffield',
        'Hornsea',
        'Withernsea',
        'Market Weighton'
      ],
      'North Yorkshire': [
        'York',
        'Harrogate',
        'Scarborough',
        'Northallerton',
        'Selby',
        'Skipton',
        'Whitby',
        'Ripon',
        'Thirsk',
        'Malton'
      ],
      'South Yorkshire': [
        'Sheffield',
        'Doncaster',
        'Rotherham',
        'Barnsley',
        'Wombwell',
        'Mexborough',
        'Wath upon Dearne',
        'Hoyland'
      ],
      'West Yorkshire': [
        'Leeds',
        'Bradford',
        'Wakefield',
        'Huddersfield',
        'Halifax',
        'Dewsbury',
        'Keighley',
        'Castleford',
        'Pontefract',
        'Batley'
      ]
    }
  }
};

export type Region = keyof typeof UK_REGIONS;
export type County = string;
export type Town = string;

// Helper function to validate locations
export const isValidLocation = (
  region: string,
  county: string,
  town: string
): boolean => {
  if (!UK_REGIONS[region]) return false;
  if (!UK_REGIONS[region].counties.includes(county)) return false;
  if (!UK_REGIONS[region].towns[county].includes(town)) return false;
  return true;
};
