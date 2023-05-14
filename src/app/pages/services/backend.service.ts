import { Injectable } from "@angular/core";
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ApiResult } from "src/app/shared/common.type";

@Injectable({
    providedIn: `root`,
  })
export class BackendService {
 
  private  apiVersion:string = "v1";

    constructor(private http: HttpClient) {}

    public login<ApiResult>(usrname:string, password:string) :Observable<any>{
      const url = `api/${this.apiVersion}/auth/login`;
      return this.http.post(url,{
        name:usrname,
        password:password
      } );
    }

    public getProjecBuildFileFromGitlab<ApiResult>(projectId:string, branchName:string) :Observable<any>{
      const url = `api/${this.apiVersion}/gitLab/project/${projectId}/file/build`;
      return this.http.get(url,
        {
          params:{
            branchName: branchName
          }
        });
    }
    
    public getProjectListFromGitlab<ApiResult>() :Observable<any>{
      const url = `api/${this.apiVersion}/gitLab/project/list`;
      return this.http.get(url);
    }
    public getBranchListFromGitlab<ApiResult>(projectId:string,search:string) :Observable<any>{
      const url = `api/${this.apiVersion}/gitLab/project/${projectId}/branch/list`;
      return this.http.get(url,{
        params:{
          search:search
        }
      });
    }
    public getPackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public getPackageConfigDetail<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}/detail`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public getPackageConfigList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public createPackageConfig<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig`;
      return this.http.post(url,data);
    }
    
    public updatePackageConfig<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.put(url,data);
    }
    public updatePackageMetadata<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}/metadata`;
      return this.http.put(url,data);
    }
  
    
    public deletePackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.delete(url);
    }


    public fromVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/fromversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public toVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/toversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public jobList<ApiResult>(platformUrl:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/job/list`;
      
      return this.http.get(url,{
        params:{
          platformUrl:platformUrl
        }
      });
    }
    public createBuild<ApiResult>(data:any):Observable<any> {
      const url = `api/${this.apiVersion}/triggertemplate`;
      return this.http.post(url,data);
    }
    public build<ApiResult>(id:string, data:any):Observable<any> {
      const url = `api/${this.apiVersion}/buildPipeline/${id}/build`;
      return this.http.post(url,data);
    }
    
    public buildList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/triggertemplate/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public deleteBuild<ApiResult>(id:string):Observable<any> {
      const url = `api/${this.apiVersion}/triggertemplate/${id}`;
      return this.http.delete(url,{
        params:{
          id:id
        }
      });
    }

    public getBuild<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/triggertemplate/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public buildHistoryList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/buildHistory/list`;
      return this.http.get(url,{
        params:data
      });
    }

    public createApplication<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/application`;
        return this.http.post(url,data);
      }
      
      public deleteApplication<ApiResult>(applicationId: string) :Observable<any>{
        const url = `api/${this.apiVersion}/application/${applicationId}`;
        return this.http.delete(url);
      }
      public applicationList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/application/list`;
        
        return this.http.get(url,{
          params:data
        });
      }

      public getApplication<ApiResult>(id:string):Observable<any> {
        const url = `api/${this.apiVersion}/application/${id}`;
        return this.http.get(url);
      }

      public groupList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/groups/list`;
        return this.http.get(url,{
          params:data
        });
      }
      
      public projectBranchList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/project/branch/list`;
        return this.http.get(url,{
          params:data
        });
      }
      public projectList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/project/list`;
        return this.http.get(url);
      }


    public createProduct<ApiResult>(data:any):Observable<any>  {
        const url = `api/${this.apiVersion}/product`;
        return this.http.post(url,data);
      }
      
      public deleteProduct<ApiResult>(productId: string):Observable<any> {
        const url = `api/${this.apiVersion}/product/${productId}`;
        return this.http.delete(url);
      }

      public productAll<ApiResult>() :Observable<any>{
        const url = `api/${this.apiVersion}/product/all`;
        return this.http.get(url);
      }

      public productList<ApiResult>(data:any) :Observable<any>{
        const url = `api/${this.apiVersion}/product/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public createProductVersion<ApiResult>(data:any):Observable<any>  {
        const url = `api/${this.apiVersion}/productversion`;
        return this.http.post(url,data);
      }
      public getProductVersion<ApiResult>(templateId: string):Observable<any> {
        const url = `api/${this.apiVersion}/productversion/${templateId}`;
        return this.http.get(url);
      }

      public productVersionList<ApiResult>(data:any) :Observable<any>{
        const url = `api/${this.apiVersion}/productversion/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public createTemplate<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/template`;
        return this.http.post(url,data);
      }
      
      public getTemplate<ApiResult>(templateId: string):Observable<any> {
        const url = `api/${this.apiVersion}/template/${templateId}`;
        return this.http.get(url);
      }
      public templateList<ApiResult>(data:any):Observable<any>{
        const url = `api/${this.apiVersion}/template/list`;
        return this.http.get(url,{params:data});
      }
      
      public createTemplateConfig<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/templateconfig`;
        return this.http.post(url,data);
      }
      
      public getTemplateConfig<ApiResult>(templateId: string):Observable<any> {
        const url = `api/${this.apiVersion}/templateconfig/${templateId}`;
        return this.http.get(url);
      }
      public templateConfigList<ApiResult>( templateId: string):Observable<any>{
        const url = `api/${this.apiVersion}/templateconfig/${templateId}/list`;
        return this.http.get(url);
      }

}