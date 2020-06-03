import { IProfileEdit } from "./../_models/IProfile";
import { RootStore } from "./RootStore";
import { observable, action, computed } from "mobx";
import agent from "../api/agent";
import { IProfile } from "../_models/IProfile";

export default class ProfileStore {
  rootStore: RootStore;
  @observable uploadingPhoto: boolean = false;
  @observable profile: IProfile | null = null;
  @observable loadingProfile: boolean = true;
  @observable follows: IProfile[] = [];
  @observable activeTab: number = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // reaction(
    //   () => this.activeTab,
    //   (activeTab) => {
    //     if (activeTab === 3 || activeTab === 4) {
    //       const predicate = activeTab === 3 ? "followers" : "following";
    //       this.loadFollowings(predicate);
    //     } else {
    //       this.followings = [];
    //     }
    //   }
    // );
  }
  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profile.addPhoto(file);
      if (this.profile) {
        this.profile.image = photo.url;
        if (this.rootStore.userStore.user) {
          this.rootStore.userStore.user.image = photo.url;
        }
      }
      this.uploadingPhoto = false;
    } catch (error) {
      console.log(error);
      alert(error);
      this.uploadingPhoto = false;
    }
  };
  @action deletePhoto = async () => {
    this.loadingProfile = true;
    try {
      await agent.Profile.deletePhoto(this.rootStore.userStore.user?.userName!);
      this.profile!.image = null;
      this.loadingProfile = false;
    } catch (error) {
      console.log("error", error);
      this.loadingProfile = false;
      alert("Problem deleting photo");
    }
  };

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.username;
    }
    return false;
  }

  @action setActiveTab = (activeIndex: any) => {
    console.log("activeIndex", activeIndex);
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profile.getProfile(username);
      console.log("profile", profile);
      this.profile = profile;
      this.loadingProfile = false;
    } catch (error) {
      this.loadingProfile = false;
      console.log(error);
    }
  };

  //   @action uploadPhoto = async (file: Blob) => {
  //     this.uploadingPhoto = true;
  //     try {
  //       const photo = await agent.Profiles.uploadPhoto(file);
  //       runInAction(() => {
  //         if (this.profile) {
  //           this.profile.photos.push(photo);
  //           if (photo.isMain && this.rootStore.userStore.user) {
  //             this.rootStore.userStore.user.image = photo.url;
  //             this.profile.image = photo.url;
  //           }
  //         }
  //         this.uploadingPhoto = false;
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Problem uploading photo");
  //       runInAction(() => {
  //         this.uploadingPhoto = false;
  //       });
  //     }
  //   };

  @action updateProfile = async (profile: IProfileEdit) => {
    try {
      const updatedProfile = await agent.Profile.editProfile(profile);
      if (this.rootStore.userStore.user!.userName) {
        this.rootStore.userStore.user!.fullName = profile.fullName!;
      }
      this.profile = { ...this.profile!, ...updatedProfile };
    } catch (error) {
      alert("Problem updating profile");
    }
  };

  @action follow = async (username: string) => {
    this.loadingProfile = true;
    try {
      await agent.Profile.follow(username);
      this.profile!.isFollowed = true;
      this.profile!.followersCount++;
      this.loadingProfile = false;
    } catch (error) {
      alert("Problem following user");
      this.loadingProfile = false;
    }
  };

  @action unfollow = async (username: string) => {
    this.loadingProfile = true;
    try {
      await agent.Profile.unfollow(username);
      this.profile!.isFollowed = false;
      this.profile!.followersCount--;
      this.loadingProfile = false;
    } catch (error) {
      alert("Problem unfollowing user");
      this.loadingProfile = false;
    }
  };

  @action loadFollowings = async (isFollower: boolean) => {
    // this.loadingProfile = true;
    try {
      const profiles = await agent.Profile.listFollowings(
        this.profile!.username,
        isFollower
      );
      this.follows = profiles;
      this.loadingProfile = false;
    } catch (error) {
      alert("Problem loading followings");
      this.loadingProfile = false;
    }
  };
}
