import json
import os

import dataset

def get_db():
    return "".join(["sqlite:///", os.path.join(os.getcwd(), "migration.db")])

db = dataset.connect(get_db())
 
with open("piracymoe\\static\\data.json", encoding="utf8") as json_file:
    data = json.load(json_file)

english_anime_sites = db.create_table("englishAnimeSites")

for entry in data["englishAnimeSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    resolution_360p = entry["360p"]
    resolution_480p = entry["480p"]
    resolution_720p = entry["720p"]
    resolution_1080p = entry["1080p"]
    has_subs = entry["hasSubs"]
    has_dubs = entry["hasDubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_watermarks = entry["hasWatermarks"]
    has_disqus = entry["hasDisqusSupport"]
    has_schedule = entry["hasReleaseSchedule"]
    has_downloads = entry["hasDirectDownloads"]
    has_batch_downloads = entry["hasBatchDownloads"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["englishAnimeSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            resolution360p=resolution_360p,
            resolution480p=resolution_480p,
            resolution720p=resolution_720p,
            resolution1080p=resolution_1080p,
            hasSubs=has_subs,
            hasDubs=has_dubs,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            hasWatermarks=has_watermarks,
            malSyncSupport=malsync_support,
            hasDisqusSupport=has_disqus,
            hasReleaseSchedule=has_schedule,
            hasDirectDownloads=has_downloads,
            hasBatchDownloads=has_batch_downloads,
            editorNotes=editor_notes
        ))

print("Migrated englishAnimeSites to DB.")

foreign_anime_sites = db.create_table("foreignAnimeSites")

for entry in data["foreignAnimeSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    resolution_360p = entry["360p"]
    resolution_480p = entry["480p"]
    resolution_720p = entry["720p"]
    resolution_1080p = entry["1080p"]
    has_subs = entry["hasSubs"]
    has_dubs = entry["hasDubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_watermarks = entry["hasWatermarks"]
    has_disqus = entry["hasDisqusSupport"]
    has_schedule = entry["hasReleaseSchedule"]
    has_downloads = entry["hasDirectDownloads"]
    has_batch_downloads = entry["hasBatchDownloads"]
    editor_notes = entry["editorNotes"]
    site_language = entry["otherLanguages"]

    with dataset.connect(get_db()) as db:
        db["foreignAnimeSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            resolution360p=resolution_360p,
            resolution480p=resolution_480p,
            resolution720p=resolution_720p,
            resolution1080p=resolution_1080p,
            hasSubs=has_subs,
            hasDubs=has_dubs,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            hasWatermarks=has_watermarks,
            malSyncSupport=malsync_support,
            hasDisqusSupport=has_disqus,
            hasReleaseSchedule=has_schedule,
            hasDirectDownloads=has_downloads,
            hasBatchDownloads=has_batch_downloads,
            editorNotes=editor_notes,
            siteLanguage=site_language
        ))

print("Migrated foreignAnimeSites to DB.")

download_sites = db.create_table("downloadSites")

for entry in data["animeDownloadSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    resolution_360p = entry["360p"]
    resolution_480p = entry["480p"]
    resolution_720p = entry["720p"]
    resolution_1080p = entry["1080p"]
    has_subs = entry["hasSubs"]
    has_dubs = entry["hasDubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_watermarks = entry["hasWatermarks"]
    has_disqus = entry["hasDisqusSupport"]
    has_schedule = entry["hasReleaseSchedule"]
    has_downloads = entry["hasDirectDownloads"]
    has_batch_downloads = entry["hasBatchDownloads"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["downloadSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            resolution360p=resolution_360p,
            resolution480p=resolution_480p,
            resolution720p=resolution_720p,
            resolution1080p=resolution_1080p,
            hasSubs=has_subs,
            hasDubs=has_dubs,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            hasWatermarks=has_watermarks,
            malSyncSupport=malsync_support,
            hasDisqusSupport=has_disqus,
            hasReleaseSchedule=has_schedule,
            hasDirectDownloads=has_downloads,
            hasBatchDownloads=has_batch_downloads,
            editorNotes=editor_notes
        ))
    
print("Migrated downloadSites to DB.")

english_manga_aggregators = db.create_table("englishMangaAggregators")

for entry in data["englishMangaSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["englishMangaAggregators"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated englishMangaSites to DB.")

english_manga_scans = db.create_table("englishMangaScans")

for entry in data["englishMangaScans"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["englishMangaScans"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated englishMangaScans to DB.")

foreign_manga_aggregators = db.create_table("foreignMangaAggregators")

for entry in data["foreignMangaSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    site_language = entry["otherLanguages"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["foreignMangaAggregators"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            siteLanguage=site_language,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated foreignMangaSites to DB.")

foreign_manga_scans = db.create_table("foreignMangaScans")

for entry in data["foreignMangaScans"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    other_languages = entry["otherLanguages"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["foreignMangaScans"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            otherLanguages=other_languages,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated foreignMangaScans to DB.")

light_novels = db.create_table("lightNovels")

for entry in data["lightNovels"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    is_mobile_friendly = entry["isMobileFriendly"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["lightNovels"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            isMobileFriendly=is_mobile_friendly,
            editorNotes=editor_notes
        ))
    
print("Migrated lightNovels to DB.")

visual_novels = db.create_table("visualNovels")

for entry in data["visualNovels"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["lightNovels"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            editorNotes=editor_notes
        ))
    
print("Migrated visualNovels to DB.")

ios_applications = db.create_table("iosApplications")

for entry in data["iOSApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["siteFeatures"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["iosApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated iosApplications to DB.")

android_applications = db.create_table("androidApplications")

for entry in data["androidApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["siteFeatures"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["androidApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated androidApplications to DB.")

windows_applications = db.create_table("windowsApplications")

for entry in data["windowsApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["siteFeatures"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["windowsApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated windowsApplications to DB.")

macos_applications = db.create_table("macOSApplications")

for entry in data["macOSApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["siteFeatures"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["macOSApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated macOSApplications to DB.")

browser_extensions = db.create_table("browserExtensions")

for entry in data["browserExtensions"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    extension_features = entry["siteFeatures"]
    editor_notes = ""
    
    with dataset.connect(get_db()) as db:
        db["browserExtensions"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=extension_features,
            editorNotes=editor_notes
        ))
    
print("Migrated browserExtensions to DB.")

hentai_anime_sites = db.create_table("hentaiAnimeSites")

for entry in data["hentaiAnime"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    resolution_360p = entry["360p"]
    resolution_480p = entry["480p"]
    resolution_720p = entry["720p"]
    resolution_1080p = entry["1080p"]
    has_subs = entry["hasSubs"]
    has_dubs = entry["hasDubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_watermarks = entry["hasWatermarks"]
    has_disqus = entry["hasDisqusSupport"]
    has_schedule = entry["hasReleaseSchedule"]
    has_downloads = entry["hasDirectDownloads"]
    has_batch_downloads = entry["hasBatchDownloads"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiAnimeSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            resolution360p=resolution_360p,
            resolution480p=resolution_480p,
            resolution720p=resolution_720p,
            resolution1080p=resolution_1080p,
            hasSubs=has_subs,
            hasDubs=has_dubs,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            hasWatermarks=has_watermarks,
            malSyncSupport=malsync_support,
            hasDisqusSupport=has_disqus,
            hasReleaseSchedule=has_schedule,
            hasDirectDownloads=has_downloads,
            hasBatchDownloads=has_batch_downloads,
            editorNotes=editor_notes,
        ))

print("Migrated hentaiAnime to DB.")

hentai_doujinshi_sites = db.create_table("hentaiDoujinshiSites")

for entry in data["hentaiDoujinshi"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    has_downloads = entry["hasDirectDownloads"]
    has_tags = entry["hasTags"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiDoujinshiSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            hasDirectDownloads=has_downloads,
            hasTags=has_tags,
            editorNotes=editor_notes,
        ))

print("Migrated hentaiDoujinshi to DB.")

hentai_download_sites = db.create_table("hentaiDownloadSites")

for entry in data["hentaiDownload"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    has_downloads = entry["hasDirectDownloads"]
    has_tags = entry["hasTags"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiDownloadSites"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            hasDirectDownloads=has_downloads,
            hasTags=has_tags,
            editorNotes=editor_notes,
        ))

print("Migrated hentaiDownload to DB.")

hentai_applications = db.create_table("hentaiApplications")

for entry in data["hentaiApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    supported_platforms = entry["supportPlatform"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=str(site_addresses),
            supportedPlatforms=str(supported_platforms),
            editorNotes=editor_notes,
        ))

print("Migrated hentaiApplications to DB.")
print("Migration process complete.")