import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { HeroRepository } from '../heros.js';
import { MockHerokuAdapter } from '../../adapters/index.js';
import * as Models from '../../models/index.js';

chai.use(chaiSpies);


describe('Test Hero Repository Function', function () {

    const mockHeroRepository = new HeroRepository();
    const mockServer = new MockHerokuAdapter();
    const mockHerokuAPIAdapter = mockServer.mockHerokuAdapter
    mockHeroRepository._herokuAdapter = mockHerokuAPIAdapter;

    beforeEach(function () {
        mockServer.init();
    })

    afterEach(function () {
        mockServer.reset();
        chai.spy.restore(mockHerokuAPIAdapter, 'getHeroes');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHero');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHeroProfile');
        chai.spy.restore(mockHerokuAPIAdapter, 'authUser');
    });

    it('Should Return Unauthorized Hero List ', async function () {

        const getHeroesSpy = chai.spy.on(mockHerokuAPIAdapter, 'getHeroes');

        const result = await mockHeroRepository.getHeroList();
        expect(getHeroesSpy).to.have.been.called.exactly(1);

        expect(result).to.be.an.instanceof(Models.RetrieveHeroListModel);
        const heroList = result.heroes;
        expect(heroList).to.be.an('array');
        const singleHero = heroList[0];
        expect(singleHero).to.be.an.instanceof(Models.RetrieveSingleHeroModel);
        expect(singleHero.id).to.equal(mockServer.mockSingleHeroResponse.id);
        expect(singleHero.name).to.equal(mockServer.mockSingleHeroResponse.name);
        expect(singleHero.image).to.equal(mockServer.mockSingleHeroResponse.image);

    });

    it('Should Return Authorized Single Hero List ', async function () {

        const getHeroesSpy = chai.spy.on(mockHerokuAPIAdapter, 'getHeroes');
        const getSingleHeroProfileSpy = chai.spy.on(mockHerokuAPIAdapter, 'getSingleHeroProfile');

        const detailedHeroList = await mockHeroRepository.getAuthenticatedHeroList();
        expect(getHeroesSpy).to.have.been.called.exactly(1);
        expect(getSingleHeroProfileSpy).to.have.been.called.exactly(mockServer.mockHerosResponse.length);

        expect(detailedHeroList).to.be.an.instanceof(Models.RetrieveHeroDetailListModel);
        const heroList = detailedHeroList.heroes;
        expect(heroList).to.be.an('array');
        const detailedSingleHero = heroList[0];
        expect(detailedSingleHero.id).to.equal(mockServer.mockSingleHeroResponse.id);
        expect(detailedSingleHero.name).to.equal(mockServer.mockSingleHeroResponse.name);
        expect(detailedSingleHero.image).to.equal(mockServer.mockSingleHeroResponse.image);
        const profile = detailedSingleHero.profile;
        expect(profile).to.be.an.instanceof(Models.HeroProfileModel);
        expect(profile.str).to.equal(mockServer.mockSingleHeroProfileResponse01.str);
        expect(profile.int).to.equal(mockServer.mockSingleHeroProfileResponse01.int);
        expect(profile.agi).to.equal(mockServer.mockSingleHeroProfileResponse01.agi);
        expect(profile.luk).to.equal(mockServer.mockSingleHeroProfileResponse01.luk);
    });


    it('Should Return Unauthorized Single Hero ', async function () {

        const getSingleHeroSpy = chai.spy.on(mockHerokuAPIAdapter, 'getSingleHero');

        const singleHero = await mockHeroRepository.getSingleHero(mockServer.mockHeroId01);
        expect(getSingleHeroSpy).to.have.been.called.exactly(1);

        expect(singleHero).to.be.an.instanceof(Models.RetrieveSingleHeroModel);
        expect(singleHero.id).to.equal(mockServer.mockSingleHeroResponse.id);
        expect(singleHero.name).to.equal(mockServer.mockSingleHeroResponse.name);
        expect(singleHero.image).to.equal(mockServer.mockSingleHeroResponse.image);
    });

    it('Should Return Authorized Single Hero ', async function () {

        const getSingleHeroSpy = chai.spy.on(mockHerokuAPIAdapter, 'getSingleHero');
        const getSingleHeroProfileSpy = chai.spy.on(mockHerokuAPIAdapter, 'getSingleHeroProfile');

        const detailedSingleHero = await mockHeroRepository.getAuthenticatedSingleHero(mockServer.mockHeroId01);
        expect(getSingleHeroSpy).to.have.been.called.exactly(1);
        expect(getSingleHeroProfileSpy).to.have.been.called.exactly(1);

        expect(detailedSingleHero).to.be.an.instanceof(Models.RetrieveSingleHeroDetailModel);
        expect(detailedSingleHero.id).to.equal(mockServer.mockSingleHeroResponse.id);
        expect(detailedSingleHero.name).to.equal(mockServer.mockSingleHeroResponse.name);
        expect(detailedSingleHero.image).to.equal(mockServer.mockSingleHeroResponse.image);

        const profile = detailedSingleHero.profile;
        expect(profile).to.be.an.instanceof(Models.HeroProfileModel);
        expect(profile.str).to.equal(mockServer.mockSingleHeroProfileResponse01.str);
        expect(profile.int).to.equal(mockServer.mockSingleHeroProfileResponse01.int);
        expect(profile.agi).to.equal(mockServer.mockSingleHeroProfileResponse01.agi);
        expect(profile.luk).to.equal(mockServer.mockSingleHeroProfileResponse01.luk);
    });


});
