import json
import os

import dataset

def get_db():
    return "".join(["sqlite:///", os.path.join(os.getcwd(), "migration.db")])

db = dataset.connect(get_db())
 
with open("piracymoe\\static\\data.json", encoding="utf8") as json_file:
    data = json.load(json_file)

english_anime_sites = db.create_table("englishAnimeSites")
english_anime_sites.create_column("siteName", db.types.text)
english_anime_sites.create_column("siteAddresses", db.types.text)
english_anime_sites.create_column("resolution360p", db.types.text)
english_anime_sites.create_column("resolution480p", db.types.text)
english_anime_sites.create_column("resolution720p", db.types.text)
english_anime_sites.create_column("resolution1080p", db.types.text)
english_anime_sites.create_column("hasSubs", db.types.text)
english_anime_sites.create_column("hasDubs", db.types.text)
english_anime_sites.create_column("hasAds", db.types.text)
english_anime_sites.create_column("hasAntiAdblock", db.types.text)
english_anime_sites.create_column("isMobileFriendly", db.types.text)
english_anime_sites.create_column("hasWatermarks", db.types.text)
english_anime_sites.create_column("hasDisqusSupport", db.types.text)
english_anime_sites.create_column("hasReleaseSchedule", db.types.text)
english_anime_sites.create_column("hasDirectDownloads", db.types.text)
english_anime_sites.create_column("hasBatchDownloads", db.types.text)
english_anime_sites.create_column("malSyncSupport", db.types.text)
english_anime_sites.create_column("editorNotes", db.types.text)

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
            siteAddresses=site_addresses,
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

print("Migrated englishAnimeSites to DB.")

foreign_anime_sites = db.create_table("foreignAnimeSites")
foreign_anime_sites.create_column("siteName", db.types.text)
foreign_anime_sites.create_column("siteAddresses", db.types.text)
foreign_anime_sites.create_column("resolution360p", db.types.text)
foreign_anime_sites.create_column("resolution480p", db.types.text)
foreign_anime_sites.create_column("resolution720p", db.types.text)
foreign_anime_sites.create_column("resolution1080p", db.types.text)
foreign_anime_sites.create_column("hasSubs", db.types.text)
foreign_anime_sites.create_column("hasDubs", db.types.text)
foreign_anime_sites.create_column("hasAds", db.types.text)
foreign_anime_sites.create_column("hasAntiAdblock", db.types.text)
foreign_anime_sites.create_column("isMobileFriendly", db.types.text)
foreign_anime_sites.create_column("hasWatermarks", db.types.text)
foreign_anime_sites.create_column("hasDisqusSupport", db.types.text)
foreign_anime_sites.create_column("hasReleaseSchedule", db.types.text)
foreign_anime_sites.create_column("hasDirectDownloads", db.types.text)
foreign_anime_sites.create_column("hasBatchDownloads", db.types.text)
foreign_anime_sites.create_column("editorNotes", db.types.text)
foreign_anime_sites.create_column("siteLanguage", db.types.text)

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
            siteAddresses=site_addresses,
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


download_sites = db.create_table("downloadSites")
download_sites.create_column("siteName", db.types.text)
download_sites.create_column("siteAddresses", db.types.text)
download_sites.create_column("resolution360p", db.types.text)
download_sites.create_column("resolution480p", db.types.text)
download_sites.create_column("resolution720p", db.types.text)
download_sites.create_column("resolution1080p", db.types.text)
download_sites.create_column("hasSubs", db.types.text)
download_sites.create_column("hasDubs", db.types.text)
download_sites.create_column("hasAds", db.types.text)
download_sites.create_column("hasAntiAdblock", db.types.text)
download_sites.create_column("isMobileFriendly", db.types.text)
download_sites.create_column("hasWatermarks", db.types.text)
download_sites.create_column("hasDisqusSupport", db.types.text)
download_sites.create_column("hasReleaseSchedule", db.types.text)
download_sites.create_column("hasDirectDownloads", db.types.text)
download_sites.create_column("hasBatchDownloads", db.types.text)
download_sites.create_column("editorNotes", db.types.text)

for entry in data["downloadSites"]:
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
            siteAddresses=site_addresses,
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
english_manga_aggregators.create_column("siteName", db.types.text)
english_manga_aggregators.create_column("siteAddresses", db.types.text)
english_manga_aggregators.create_column("hasAds", db.types.text)
english_manga_aggregators.create_column("hasAntiAdblock", db.types.text)
english_manga_aggregators.create_column("isMobileFriendly", db.types.text)
english_manga_aggregators.create_column("malSyncSupport", db.types.text)
english_manga_aggregators.create_column("hasTachiyomiSupport", db.types.text)
english_manga_aggregators.create_column("editorNotes", db.types.text)

for entry in data["englishMangaSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_subs = entry["hasSubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["englishMangaAggregators"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated englishMangaSites to DB.")

english_manga_scans = db.create_table("englishMangaScans")
english_manga_scans.create_column("siteName", db.types.text)
english_manga_scans.create_column("siteAddresses", db.types.text)
english_manga_scans.create_column("hasAds", db.types.text)
english_manga_scans.create_column("hasAntiAdblock", db.types.text)
english_manga_scans.create_column("isMobileFriendly", db.types.text)
english_manga_scans.create_column("malSyncSupport", db.types.text)
english_manga_scans.create_column("hasTachiyomiSupport", db.types.text)
english_manga_scans.create_column("editorNotes", db.types.text)

for entry in data["englishMangaScans"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_subs = entry["hasSubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["englishMangaScans"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            malSyncSupport=malsync_support,
            hasTachiyomiSupport=has_tachiyomi_support,
            editorNotes=editor_notes
        ))
    
print("Migrated englishMangaSites to DB.")

foreign_manga_aggregators = db.create_table("foreignMangaAggregators")
foreign_manga_aggregators.create_column("siteName", db.types.text)
foreign_manga_aggregators.create_column("siteAddresses", db.types.text)
foreign_manga_aggregators.create_column("hasAds", db.types.text)
foreign_manga_aggregators.create_column("hasAntiAdblock", db.types.text)
foreign_manga_aggregators.create_column("siteLanguage", db.types.text)
foreign_manga_aggregators.create_column("isMobileFriendly", db.types.text)
foreign_manga_aggregators.create_column("malSyncSupport", db.types.text)
foreign_manga_aggregators.create_column("hasTachiyomiSupport", db.types.text)
foreign_manga_aggregators.create_column("editorNotes", db.types.text)

for entry in data["foreignMangaSites"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_subs = entry["hasSubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    site_language = entry["siteLanguage"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["foreignMangaAggregators"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
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
foreign_manga_scans.create_column("siteName", db.types.text)
foreign_manga_scans.create_column("siteAddresses", db.types.text)
foreign_manga_scans.create_column("hasAds", db.types.text)
foreign_manga_scans.create_column("hasAntiAdblock", db.types.text)
foreign_manga_scans.create_column("siteLanguage", db.types.text)
foreign_manga_scans.create_column("isMobileFriendly", db.types.text)
foreign_manga_scans.create_column("malSyncSupport", db.types.text)
foreign_manga_scans.create_column("hasTachiyomiSupport", db.types.text)
foreign_manga_scans.create_column("editorNotes", db.types.text)

for entry in data["foreignMangaScans"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_subs = entry["hasSubs"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    malsync_support = entry["malSyncSupport"]
    has_tachiyomi_support = entry["hasTachiyomiSupport"]
    other_languages = entry["otherLanguages"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["foreignMangaScans"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
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
light_novels.create_column("siteName", db.types.text)
light_novels.create_column("siteAddresses", db.types.text)
light_novels.create_column("hasAds", db.types.text)
light_novels.create_column("hasAntiAdblock", db.types.text)
light_novels.create_column("isMobileFriendly", db.types.text)
light_novels.create_column("editorNotes", db.types.text)

for entry in data["lightNovels"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    is_mobile_friendly = entry["isMobileFriendly"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["lightNovels"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            isMobileFriendly=is_mobile_friendly,
            editorNotes=editor_notes
        ))
    
print("Migrated lightNovels to DB.")

visual_novels = db.create_table("visualNovels")
visual_novels.create_column("siteName", db.types.text)
visual_novels.create_column("siteAddresses", db.types.text)
visual_novels.create_column("hasAds", db.types.text)
visual_novels.create_column("hasAntiAdblock", db.types.text)
visual_novels.create_column("editorNotes", db.types.text)

for entry in data["visualNovels"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["hasAntiAdblock"]
    is_mobile_friendly = entry["isMobileFriendly"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["lightNovels"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            isMobileFriendly=is_mobile_friendly,
            editorNotes=editor_notes
        ))
    
print("Migrated visualNovels to DB.")

ios_applications = db.create_table("iosApplications")
ios_applications.create_column("siteName", db.types.text)
ios_applications.create_column("siteAddresses", db.types.text)
ios_applications.create_column("hasMalSupport", db.types.text)
ios_applications.create_column("hasAnilistSupport", db.types.text)
ios_applications.create_column("hasKitsuSupport", db.types.text)
ios_applications.create_column("hasSimKLSupport", db.types.text)
ios_applications.create_column("applicationFeatures", db.types.text)
ios_applications.create_column("editorNotes", db.types.text)

for entry in data["iosApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["applicationFeatures"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["iosApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated iosApplications to DB.")

android_applications = db.create_table("androidApplications")
android_applications.create_column("siteName", db.types.text)
android_applications.create_column("siteAddresses", db.types.text)
android_applications.create_column("hasMalSupport", db.types.text)
android_applications.create_column("hasAnilistSupport", db.types.text)
android_applications.create_column("hasKitsuSupport", db.types.text)
android_applications.create_column("hasSimKLSupport", db.types.text)
android_applications.create_column("applicationFeatures", db.types.text)
android_applications.create_column("editorNotes", db.types.text)

for entry in data["androidApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["applicationFeatures"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["androidApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated androidApplications to DB.")

windows_applications = db.create_table("windowsApplications")
windows_applications.create_column("siteName", db.types.text)
windows_applications.create_column("siteAddresses", db.types.text)
windows_applications.create_column("hasMalSupport", db.types.text)
windows_applications.create_column("hasAnilistSupport", db.types.text)
windows_applications.create_column("hasKitsuSupport", db.types.text)
windows_applications.create_column("hasSimKLSupport", db.types.text)
windows_applications.create_column("applicationFeatures", db.types.text)
windows_applications.create_column("editorNotes", db.types.text)

for entry in data["windowsApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["applicationFeatures"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["windowsApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated windowsApplications to DB.")

macos_applications = db.create_table("macOSApplications")
macos_applications.create_column("siteName", db.types.text)
macos_applications.create_column("siteAddresses", db.types.text)
macos_applications.create_column("hasMalSupport", db.types.text)
macos_applications.create_column("hasAnilistSupport", db.types.text)
macos_applications.create_column("hasKitsuSupport", db.types.text)
macos_applications.create_column("hasSimKLSupport", db.types.text)
macos_applications.create_column("applicationFeatures", db.types.text)
macos_applications.create_column("editorNotes", db.types.text)

for entry in data["macOSApplications"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["applicationFeatures"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["macOSApplications"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated macOSApplications to DB.")

browser_extensions = db.create_table("browserExtensions")
browser_extensions.create_column("siteName", db.types.text)
browser_extensions.create_column("siteAddresses", db.types.text)
browser_extensions.create_column("hasMalSupport", db.types.text)
browser_extensions.create_column("hasAnilistSupport", db.types.text)
browser_extensions.create_column("hasKitsuSupport", db.types.text)
browser_extensions.create_column("hasSimKLSupport", db.types.text)
browser_extensions.create_column("extensionFeatures", db.types.text)
browser_extensions.create_column("editorNotes", db.types.text)

for entry in data["browserExtensions"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_mal_support = entry["hasMalSupport"]
    has_al_support = entry["hasAnilistSupport"]
    has_kitsu_support = entry["hasKitsuSupport"]
    has_simkl_support = entry["hasSimKLSupport"]
    application_features = entry["applicationFeatures"]
    editor_notes = entry["editorNotes"]
    
    with dataset.connect(get_db()) as db:
        db["browserExtensions"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasMalSupport=has_mal_support,
            hasAnilistSupport=has_al_support,
            hasKitsuSupport=has_kitsu_support,
            hasSimKLSupport=has_simkl_support,
            applicationFeatures=application_features,
            editorNotes=editor_notes
        ))
    
print("Migrated browserExtensions to DB.")

hentai_anime_sites = db.create_table("hentaiAnimeSites")
hentai_anime_sites.create_column("siteName", db.types.text)
hentai_anime_sites.create_column("siteAddresses", db.types.text)
hentai_anime_sites.create_column("resolution360p", db.types.text)
hentai_anime_sites.create_column("resolution480p", db.types.text)
hentai_anime_sites.create_column("resolution720p", db.types.text)
hentai_anime_sites.create_column("resolution1080p", db.types.text)
hentai_anime_sites.create_column("hasSubs", db.types.text)
hentai_anime_sites.create_column("hasDubs", db.types.text)
hentai_anime_sites.create_column("hasAds", db.types.text)
hentai_anime_sites.create_column("hasAntiAdblock", db.types.text)
hentai_anime_sites.create_column("isMobileFriendly", db.types.text)
hentai_anime_sites.create_column("hasWatermarks", db.types.text)
hentai_anime_sites.create_column("hasDisqusSupport", db.types.text)
hentai_anime_sites.create_column("hasReleaseSchedule", db.types.text)
hentai_anime_sites.create_column("hasDirectDownloads", db.types.text)
hentai_anime_sites.create_column("hasBatchDownloads", db.types.text)
hentai_anime_sites.create_column("malSyncSupport", db.types.text)
hentai_anime_sites.create_column("editorNotes", db.types.text)

for entry in data["hentaiAnimeSites"]:
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
            siteAddresses=site_addresses,
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

print("Migrated hentaiAnimeSites to DB.")

hentai_doujinshi_sites = db.create_table("hentaiDoujinshiSites")
hentai_doujinshi_sites.create_column("siteName", db.types.text)
hentai_doujinshi_sites.create_column("siteAddresses", db.types.text)
hentai_doujinshi_sites.create_column("hasAds", db.types.text)
hentai_doujinshi_sites.create_column("hasAntiAdblock", db.types.text)
hentai_doujinshi_sites.create_column("hasDirectDownloads", db.types.text)
hentai_doujinshi_sites.create_column("hasTags", db.types.text)
hentai_doujinshi_sites.create_column("editorNotes", db.types.text)

for entry in data["hentaiDoujinshi"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    has_watermarks = entry["hasWatermarks"]
    has_downloads = entry["hasDirectDownloads"]
    has_tags = entry["hasTags"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiDoujinshiSites"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            hasDirectDownloads=has_downloads,
            hasTags=has_tags,
            editorNotes=editor_notes,
        ))

print("Migrated hentaiDoujinshi to DB.")

hentai_download_sites = db.create_table("hentaiDownloadSites")
hentai_download_sites.create_column("siteName", db.types.text)
hentai_download_sites.create_column("siteAddresses", db.types.text)
hentai_download_sites.create_column("hasAds", db.types.text)
hentai_download_sites.create_column("hasAntiAdblock", db.types.text)
hentai_download_sites.create_column("hasDirectDownloads", db.types.text)
hentai_download_sites.create_column("hasTags", db.types.text)
hentai_download_sites.create_column("hasTorrents", db.types.text)
hentai_download_sites.create_column("editorNotes", db.types.text)

for entry in data["hentaiDownload"]:
    site_name = entry["siteName"]
    site_addresses = entry["siteAddresses"]
    has_ads = entry["hasAds"]
    has_anti_adblock = entry["isAntiAdblock"]
    has_watermarks = entry["hasWatermarks"]
    has_downloads = entry["hasDirectDownloads"]
    has_tags = entry["hasTags"]
    editor_notes = entry["editorNotes"]

    with dataset.connect(get_db()) as db:
        db["hentaiDownloadSites"].insert(dict(
            siteName=site_name,
            siteAddresses=site_addresses,
            hasAds=has_ads,
            hasAntiAdblock=has_anti_adblock,
            hasDirectDownloads=has_downloads,
            hasTags=has_tags,
            editorNotes=editor_notes,
        ))

print("Migrated hentaiDownload to DB.")